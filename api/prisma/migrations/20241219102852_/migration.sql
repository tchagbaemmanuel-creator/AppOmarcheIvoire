-- CreateEnum
CREATE TYPE "area_code" AS ENUM ('ABOBO', 'ADJAME', 'ATTECOUBE', 'COCODY', 'KOUMASSI', 'MARCORY', 'PLATEAU', 'TREICHVILLE', 'YOPOUGON', 'BROFODOUME', 'BINGERVILLE', 'PORT_BOUET', 'ANYAMA', 'SONGON');

-- CreateEnum
CREATE TYPE "order_status" AS ENUM ('IDLE', 'PROCESSING', 'PROCESSED', 'COLLECTING', 'DELIVERING', 'DELIVERED', 'CANCELED');

-- CreateEnum
CREATE TYPE "promo_code_type" AS ENUM ('PERCENTAGE', 'FIXED');

-- CreateEnum
CREATE TYPE "product_category" AS ENUM ('Legumes', 'Fruits', 'Viandes', 'Poissons', 'Cereales', 'Tubercules', 'Mer', 'Epices', 'Autres');

-- CreateEnum
CREATE TYPE "product_unit" AS ENUM ('KG', 'DEMI_KG', 'TAS', 'LITRE', 'SAC', 'BOITE', 'MORCEAUX', 'UNIT', 'AUTRE');

-- CreateTable
CREATE TABLE "Market" (
    "marketId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "pictureUrl" VARCHAR(255),
    "name" VARCHAR(50) NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "areaCode" "area_code" NOT NULL,
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Market_pkey" PRIMARY KEY ("marketId")
);

-- CreateTable
CREATE TABLE "OrderProducts" (
    "orderProductId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "orderId" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderProducts_pkey" PRIMARY KEY ("orderProductId")
);

-- CreateTable
CREATE TABLE "Order" (
    "orderId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "locationX" DECIMAL(10,6) NOT NULL,
    "locationY" DECIMAL(10,6) NOT NULL,
    "agentId" UUID,
    "shipperId" UUID,
    "address" TEXT NOT NULL,
    "deliveryTime" VARCHAR(50) NOT NULL,
    "paymentMethod" VARCHAR(50) NOT NULL,
    "promoCodeId" UUID,
    "status" "order_status" NOT NULL DEFAULT 'IDLE',
    "cancellationReason" VARCHAR(255),
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("orderId")
);

-- CreateTable
CREATE TABLE "Product" (
    "productId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "pictureUrl" TEXT[],
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "unit" "product_unit" NOT NULL DEFAULT 'KG',
    "amount" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "category" "product_category" NOT NULL DEFAULT 'Legumes',
    "sellerId" UUID NOT NULL,
    "isInStock" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("productId")
);

-- CreateTable
CREATE TABLE "Seller" (
    "sellerId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "marketId" UUID NOT NULL,
    "pictureUrl" VARCHAR(255),
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "tableNumber" INTEGER NOT NULL,
    "gender" VARCHAR(10) NOT NULL,
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Seller_pkey" PRIMARY KEY ("sellerId")
);

-- CreateTable
CREATE TABLE "User" (
    "userId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(50),
    "password" VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "city" VARCHAR(50) NOT NULL DEFAULT 'Abidjan',
    "address" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Admin" (
    "adminId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "areaCode" "area_code",
    "email" VARCHAR(50) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("adminId")
);

-- CreateTable
CREATE TABLE "Agent" (
    "agentId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "pictureUrl" VARCHAR(255),
    "marketId" UUID NOT NULL,
    "email" VARCHAR(50),
    "password" VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "role" VARCHAR(50) NOT NULL DEFAULT 'Agent',
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("agentId")
);

-- CreateTable
CREATE TABLE "Shipper" (
    "shipperId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "marketId" UUID NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50),
    "password" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "pictureUrl" VARCHAR(255),
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shipper_pkey" PRIMARY KEY ("shipperId")
);

-- CreateTable
CREATE TABLE "PromoCode" (
    "promoCodeId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(50) NOT NULL,
    "expiration" TIMESTAMP(6) NOT NULL,
    "discountType" "promo_code_type" NOT NULL DEFAULT 'PERCENTAGE',
    "amount" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromoCode_pkey" PRIMARY KEY ("promoCodeId")
);

-- CreateTable
CREATE TABLE "GiftCard" (
    "giftCardId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID,
    "expiration" TIMESTAMP(6) NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'IDLE',
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GiftCard_pkey" PRIMARY KEY ("giftCardId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Market_name_key" ON "Market"("name");

-- CreateIndex
CREATE UNIQUE INDEX "uc_product" ON "Product"("name", "sellerId");

-- CreateIndex
CREATE UNIQUE INDEX "uc_tableinmarket" ON "Seller"("marketId", "tableNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "uc_admin" ON "Admin"("email", "areaCode");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_email_key" ON "Agent"("email");

-- CreateIndex
CREATE UNIQUE INDEX "uc_agent" ON "Agent"("email", "marketId");

-- CreateIndex
CREATE UNIQUE INDEX "Shipper_email_key" ON "Shipper"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PromoCode_code_key" ON "PromoCode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "GiftCard_userId_key" ON "GiftCard"("userId");

-- AddForeignKey
ALTER TABLE "OrderProducts" ADD CONSTRAINT "OrderProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("productId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OrderProducts" ADD CONSTRAINT "OrderProducts_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("orderId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_shipperId_fkey" FOREIGN KEY ("shipperId") REFERENCES "Shipper"("shipperId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("agentId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_promoCodeId_fkey" FOREIGN KEY ("promoCodeId") REFERENCES "PromoCode"("promoCodeId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("sellerId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Seller" ADD CONSTRAINT "Seller_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "Market"("marketId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "Market"("marketId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Shipper" ADD CONSTRAINT "Shipper_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "Market"("marketId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GiftCard" ADD CONSTRAINT "GiftCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE NO ACTION;
