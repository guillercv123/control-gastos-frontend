#!/usr/bin/env bash
# Despliega el frontend Angular a S3 + CloudFront.
# Uso: ./scripts/deploy.sh [nombre-del-stack]   (por defecto: control-gastos-frontend)
set -euo pipefail

STACK=${1:-control-gastos-frontend}
REGION=${AWS_REGION:-us-east-1}

echo "==> Leyendo outputs del stack '$STACK'..."
BUCKET=$(aws cloudformation describe-stacks --stack-name "$STACK" --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='BucketName'].OutputValue" --output text)
DIST=$(aws cloudformation describe-stacks --stack-name "$STACK" --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='DistributionId'].OutputValue" --output text)

if [ -z "${BUCKET:-}" ] || [ "$BUCKET" = "None" ]; then
  echo "No encontre el bucket. Desplegaste infra/frontend.yaml primero?"; exit 1
fi

echo "==> Compilando Angular (produccion)..."
ng build --configuration production

DIST_DIR=$(find dist -maxdepth 3 -name index.html -exec dirname {} \; | head -1)
echo "==> Subiendo '$DIST_DIR' a s3://$BUCKET ..."

aws s3 sync "$DIST_DIR" "s3://$BUCKET" --delete \
  --exclude index.html \
  --cache-control "public,max-age=31536000,immutable"

aws s3 cp "$DIST_DIR/index.html" "s3://$BUCKET/index.html" \
  --cache-control "no-cache"

echo "==> Invalidando cache de CloudFront ($DIST)..."
aws cloudfront create-invalidation --distribution-id "$DIST" --paths "/*" >/dev/null

URL=$(aws cloudformation describe-stacks --stack-name "$STACK" --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='SiteUrl'].OutputValue" --output text)
echo "==> Listo. Tu app esta en: $URL"
