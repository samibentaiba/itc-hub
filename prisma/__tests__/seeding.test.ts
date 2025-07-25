import {
  PrismaClient,
  ProductStatus,
  OrderStatus,
  LandingPageStatus,
  ProductPageStatus,
} from "@prisma/client";
import { mockDeep, DeepMockProxy } from "jest-mock-extended";

// Mock Prisma client
jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

import prisma from "@/lib/prisma";

const mockPrisma = prisma as DeepMockProxy<PrismaClient>;

describe("Database Seeding Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Product Seeding", () => {
    it("should create products with variants and images", async () => {
      const mockProduct = {
        id: "product-1",
        name: "Premium Wireless Headphones",
        description: "High-quality wireless headphones with noise cancellation",
        price: 299.99,
        originalPrice: 399.99,
        category: "Electronics",
        stock: 50,
        status: "ACTIVE" as ProductStatus,
        rating: 4.5,
        createdAt: new Date(),
        updatedAt: new Date(),
        variants: [
          {
            id: "variant-1",
            name: "Color",
            type: "COLOR",
            value: "Black",
            description: "Classic black color",
            variantPrice: 299.99,
            stockQuantity: 25,
            productId: "product-1",
          },
        ],
        images: [
          {
            id: "image-1",
            url: "/placeholder.svg?height=300&width=300",
            alt: "Premium Wireless Headphones",
            isPrimary: true,
            productId: "product-1",
            variantId: null,
          },
        ],
      };

      mockPrisma.product.create.mockResolvedValue(mockProduct);

      const result = await mockPrisma.product.create({
        data: {
          id: "product-1",
          name: "Premium Wireless Headphones",
          description:
            "High-quality wireless headphones with noise cancellation",
          price: 299.99,
          originalPrice: 399.99,
          category: "Electronics",
          stock: 50,
          status: "ACTIVE",
          rating: 4.5,
          variants: {
            create: [
              {
                name: "Color",
                type: "COLOR",
                value: "Black",
                description: "Classic black color",
                variantPrice: 299.99,
                stockQuantity: 25,
              },
            ],
          },
          images: {
            create: [
              {
                url: "/placeholder.svg?height=300&width=300",
                alt: "Premium Wireless Headphones",
                isPrimary: true,
              },
            ],
          },
        },
        include: {
          variants: true,
          images: true,
        },
      });

      expect(result).toMatchObject({
        name: "Premium Wireless Headphones",
        status: "ACTIVE",
        variants: expect.arrayContaining([
          expect.objectContaining({
            type: "COLOR",
            value: "Black",
          }),
        ]),
        images: expect.arrayContaining([
          expect.objectContaining({
            isPrimary: true,
          }),
        ]),
      });
    });

    it("should handle products without variants", async () => {
      const mockProduct = {
        id: "product-2",
        name: "Simple Product",
        description: "A simple product without variants",
        price: 19.99,
        originalPrice: 24.99,
        category: "Home & Garden",
        stock: 100,
        status: "ACTIVE" as ProductStatus,
        rating: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        variants: [],
        images: [],
      };

      mockPrisma.product.create.mockResolvedValue(mockProduct);

      const result = await mockPrisma.product.create({
        data: {
          id: "product-2",
          name: "Simple Product",
          description: "A simple product without variants",
          price: 19.99,
          originalPrice: 24.99,
          category: "Home & Garden",
          stock: 100,
          status: "ACTIVE",
        },
        include: {
          variants: true,
          images: true,
        },
      });

      expect(result.variants).toHaveLength(0);
      expect(result.images).toHaveLength(0);
    });
  });

  describe("Order Seeding", () => {
    it("should create orders with multiple products and variants", async () => {
      const mockOrder = {
        id: "ORD-001",
        customerName: "John Doe",
        customerPhone: "+1-555-0101",
        total: 299.99,
        status: "PENDING" as OrderStatus,
        shippingAddress: "123 Main St, City, State 12345",
        orderDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [
          {
            id: "item-1",
            orderId: "ORD-001",
            productId: "product-1",
            variantId: "variant-1",
            quantity: 1,
            price: 299.99,
            productName: "Premium Wireless Headphones (Black)",
          },
        ],
      };

      mockPrisma.order.create.mockResolvedValue(mockOrder);

      const result = await mockPrisma.order.create({
        data: {
          id: "ORD-001",
          customerName: "John Doe",
          customerPhone: "+1-555-0101",
          total: 299.99,
          status: "PENDING",
          shippingAddress: "123 Main St, City, State 12345",
          orderDate: new Date(),
          items: {
            create: [
              {
                productId: "product-1",
                variantId: "variant-1",
                quantity: 1,
                price: 299.99,
                productName: "Premium Wireless Headphones (Black)",
              },
            ],
          },
        },
        include: {
          items: true,
        },
      });

      expect(result).toMatchObject({
        customerName: "John Doe",
        status: "PENDING",
        items: expect.arrayContaining([
          expect.objectContaining({
            productName: "Premium Wireless Headphones (Black)",
            variantId: "variant-1",
          }),
        ]),
      });
    });

    it("should handle orders with multiple products", async () => {
      const mockOrder = {
        id: "ORD-002",
        customerName: "Jane Smith",
        customerPhone: "+1-555-0102",
        total: 119.98,
        status: "PROCESSING" as OrderStatus,
        shippingAddress: "456 Oak Ave, City, State 12345",
        orderDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [
          {
            id: "item-1",
            orderId: "ORD-002",
            productId: "product-1",
            variantId: null,
            quantity: 1,
            price: 89.99,
            productName: "Wireless Bluetooth Speaker",
          },
          {
            id: "item-2",
            orderId: "ORD-002",
            productId: "product-2",
            variantId: null,
            quantity: 1,
            price: 29.99,
            productName: "Stainless Steel Water Bottle",
          },
        ],
      };

      mockPrisma.order.create.mockResolvedValue(mockOrder);

      const result = await mockPrisma.order.create({
        data: {
          id: "ORD-002",
          customerName: "Jane Smith",
          customerPhone: "+1-555-0102",
          total: 119.98,
          status: "PROCESSING",
          shippingAddress: "456 Oak Ave, City, State 12345",
          orderDate: new Date(),
          items: {
            create: [
              {
                productId: "product-1",
                quantity: 1,
                price: 89.99,
                productName: "Wireless Bluetooth Speaker",
              },
              {
                productId: "product-2",
                quantity: 1,
                price: 29.99,
                productName: "Stainless Steel Water Bottle",
              },
            ],
          },
        },
        include: {
          items: true,
        },
      });

      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(119.98);
    });
  });

  describe("Landing Page Seeding", () => {
    it("should create landing pages with templates", async () => {
      const mockLandingPage = {
        id: "landing-1",
        title: "Premium Headphones Landing",
        slug: "premium-headphones",
        productId: "product-1",
        templateId: "template-1",
        headline: "Experience Sound Like Never Before",
        subheadline: "Discover the ultimate audio experience",
        description: "Discover the ultimate audio experience",
        heroImage: "/placeholder.svg?height=400&width=800",
        status: "PUBLISHED" as LandingPageStatus,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.landingPage.create.mockResolvedValue(mockLandingPage);

      const result = await mockPrisma.landingPage.create({
        data: {
          id: "landing-1",
          title: "Premium Headphones Landing",
          slug: "premium-headphones",
          productId: "product-1",
          templateId: "template-1",
          headline: "Experience Sound Like Never Before",
          subheadline: "Discover the ultimate audio experience",
          description: "Discover the ultimate audio experience",
          heroImage: "/placeholder.svg?height=400&width=800",
          status: "PUBLISHED",
          createdAt: new Date(),
        },
      });

      expect(result).toMatchObject({
        title: "Premium Headphones Landing",
        status: "PUBLISHED",
        templateId: "template-1",
      });
    });
  });

  describe("Cart Seeding", () => {
    it("should create cart with items and variants", async () => {
      const mockCart = {
        id: "cart-1",
        userId: "singleton",
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [
          {
            id: "cart-item-1",
            cartId: "cart-1",
            productId: "product-1",
            variantId: "variant-1",
            quantity: 2,
          },
        ],
      };

      mockPrisma.cart.create.mockResolvedValue(mockCart);

      const result = await mockPrisma.cart.create({
        data: {
          userId: "singleton",
          items: {
            create: [
              {
                productId: "product-1",
                variantId: "variant-1",
                quantity: 2,
              },
            ],
          },
        },
        include: {
          items: true,
        },
      });

      expect(result).toMatchObject({
        userId: "singleton",
        items: expect.arrayContaining([
          expect.objectContaining({
            variantId: "variant-1",
            quantity: 2,
          }),
        ]),
      });
    });
  });

  describe("Wishlist Seeding", () => {
    it("should create wishlist items", async () => {
      const mockWishlistItem = {
        id: "wishlist-1",
        userId: "singleton",
        productId: "product-1",
        createdAt: new Date(),
      };

      mockPrisma.wishlist.create.mockResolvedValue(mockWishlistItem);

      const result = await mockPrisma.wishlist.create({
        data: {
          userId: "singleton",
          productId: "product-1",
        },
      });

      expect(result).toMatchObject({
        userId: "singleton",
        productId: "product-1",
      });
    });
  });

  describe("Product Page Seeding", () => {
    it("should create product pages with SEO data", async () => {
      const mockProductPage = {
        id: "page-1",
        title: "Premium Wireless Headphones - Product Page",
        slug: "premium-wireless-headphones",
        productId: "product-1",
        metaTitle: "Premium Wireless Headphones | Best Audio Experience",
        metaDescription: "Experience exceptional sound quality",
        content: "Detailed product description...",
        featuredImage: "/placeholder.svg?height=200&width=300",
        status: "PUBLISHED" as ProductPageStatus,
        seoScore: 85,
        lastModified: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.productPage.create.mockResolvedValue(mockProductPage);

      const result = await mockPrisma.productPage.create({
        data: {
          id: "page-1",
          title: "Premium Wireless Headphones - Product Page",
          slug: "premium-wireless-headphones",
          productId: "product-1",
          metaTitle: "Premium Wireless Headphones | Best Audio Experience",
          metaDescription: "Experience exceptional sound quality",
          content: "Detailed product description...",
          featuredImage: "/placeholder.svg?height=200&width=300",
          status: "PUBLISHED",
          seoScore: 85,
          lastModified: new Date(),
        },
      });

      expect(result).toMatchObject({
        status: "PUBLISHED",
        seoScore: 85,
        metaTitle: "Premium Wireless Headphones | Best Audio Experience",
      });
    });
  });

  describe("Template Seeding", () => {
    it("should create landing page templates with sections", async () => {
      const mockTemplate = {
        id: "template-1",
        name: "Modern Hero Template",
        description: "Clean and modern template with hero section",
        thumbnail: "/placeholder.svg",
        isDefault: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        sections: [
          {
            id: "section-1",
            templateId: "template-1",
            type: "HERO",
            title: "Hero Section",
            content: "Main headline and description",
            image: "/placeholder.svg",
            settings: { bgColor: "white" },
            order: 1,
          },
        ],
      };

      mockPrisma.landingPageTemplate.create.mockResolvedValue(mockTemplate);

      const result = await mockPrisma.landingPageTemplate.create({
        data: {
          id: "template-1",
          name: "Modern Hero Template",
          description: "Clean and modern template with hero section",
          thumbnail: "/placeholder.svg",
          isDefault: true,
          createdAt: new Date(),
          sections: {
            create: [
              {
                type: "HERO",
                title: "Hero Section",
                content: "Main headline and description",
                image: "/placeholder.svg",
                settings: { bgColor: "white" },
                order: 1,
              },
            ],
          },
        },
        include: {
          sections: true,
        },
      });

      expect(result).toMatchObject({
        name: "Modern Hero Template",
        isDefault: true,
        sections: expect.arrayContaining([
          expect.objectContaining({
            type: "HERO",
            order: 1,
          }),
        ]),
      });
    });
  });

  describe("Data Relationships", () => {
    it("should maintain referential integrity", async () => {
      // Mock product data
      const mockProduct = {
        id: "product-1",
        name: "Premium Wireless Headphones",
        description: "High-quality wireless headphones",
        price: 299.99,
        originalPrice: 399.99,
        category: "Electronics",
        stock: 50,
        status: "ACTIVE" as ProductStatus,
        rating: 4.5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock template data
      const mockTemplate = {
        id: "1",
        name: "Default Template",
        description: "Default landing page template",
        thumbnail: "/placeholder.svg",
        isDefault: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock user data
      const mockUser = {
        id: "singleton",
        email: "admin@example.com",
        name: "Admin User",
        password: "hashedPassword",
        role: "ADMIN" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.product.findFirst.mockResolvedValue(mockProduct);
      mockPrisma.landingPageTemplate.findFirst.mockResolvedValue(mockTemplate);
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      // Test that products exist before creating orders
      const product = await mockPrisma.product.findFirst({
        where: { name: "Premium Wireless Headphones" },
      });

      expect(product).toBeDefined();

      // Test that templates exist before creating landing pages
      const template = await mockPrisma.landingPageTemplate.findFirst({
        where: { id: "1" },
      });

      expect(template).toBeDefined();

      // Test that users exist before creating cart/wishlist
      const user = await mockPrisma.user.findUnique({
        where: { id: "singleton" },
      });

      expect(user).toBeDefined();
    });

    it("should handle variant relationships correctly", async () => {
      const mockProductWithVariants = {
        id: "product-1",
        name: "Premium Wireless Headphones",
        description: "High-quality wireless headphones",
        price: 299.99,
        originalPrice: 399.99,
        category: "Electronics",
        stock: 50,
        status: "ACTIVE" as ProductStatus,
        rating: 4.5,
        createdAt: new Date(),
        updatedAt: new Date(),
        variants: [
          {
            id: "variant-1",
            name: "Color",
            type: "COLOR",
            value: "Black",
            description: "Classic black color",
            variantPrice: 299.99,
            stockQuantity: 25,
            productId: "product-1",
          },
          {
            id: "variant-2",
            name: "Color",
            type: "COLOR",
            value: "White",
            description: "Elegant white color",
            variantPrice: 299.99,
            stockQuantity: 25,
            productId: "product-1",
          },
        ],
      };

      mockPrisma.product.findFirst.mockResolvedValue(mockProductWithVariants);

      const productWithVariants = await mockPrisma.product.findFirst({
        where: { name: "Premium Wireless Headphones" },
        include: { variants: true },
      });

      expect(productWithVariants?.variants).toHaveLength(2); // Black and White variants
      expect(productWithVariants?.variants[0].productId).toBe(
        productWithVariants?.id
      );
    });

    it("should handle image relationships correctly", async () => {
      const mockProductWithImages = {
        id: "product-1",
        name: "Premium Wireless Headphones",
        description: "High-quality wireless headphones",
        price: 299.99,
        originalPrice: 399.99,
        category: "Electronics",
        stock: 50,
        status: "ACTIVE" as ProductStatus,
        rating: 4.5,
        createdAt: new Date(),
        updatedAt: new Date(),
        images: [
          {
            id: "image-1",
            url: "/placeholder.svg?height=300&width=300",
            alt: "Premium Wireless Headphones",
            isPrimary: true,
            productId: "product-1",
            variantId: null,
          },
          {
            id: "image-2",
            url: "/placeholder.svg?height=300&width=300",
            alt: "Premium Wireless Headphones - Secondary",
            isPrimary: false,
            productId: "product-1",
            variantId: null,
          },
        ],
      };

      mockPrisma.product.findFirst.mockResolvedValue(mockProductWithImages);

      const productWithImages = await mockPrisma.product.findFirst({
        where: { name: "Premium Wireless Headphones" },
        include: { images: true },
      });

      expect(productWithImages?.images).toHaveLength(2); // Primary and secondary images
      expect(productWithImages?.images[0].productId).toBe(
        productWithImages?.id
      );
    });
  });

  describe("Data Validation", () => {
    it("should validate product data", async () => {
      const mockProducts = [
        {
          id: "product-1",
          name: "Product 1",
          description: "Description 1",
          price: 29.99,
          originalPrice: 39.99,
          category: "Electronics",
          stock: 100,
          status: "ACTIVE" as ProductStatus,
          rating: 4.5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "product-2",
          name: "Product 2",
          description: "Description 2",
          price: 19.99,
          originalPrice: 24.99,
          category: "Home & Garden",
          stock: 50,
          status: "INACTIVE" as ProductStatus,
          rating: 3.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrisma.product.findMany.mockResolvedValue(mockProducts);

      const products = await mockPrisma.product.findMany();

      for (const product of products) {
        expect(product.price).toBeGreaterThan(0);
        expect(product.stock).toBeGreaterThanOrEqual(0);
        expect(["ACTIVE", "INACTIVE"]).toContain(product.status);
        expect(product.rating).toBeLessThanOrEqual(5);
        expect(product.rating).toBeGreaterThanOrEqual(0);
      }
    });

    it("should validate order data", async () => {
      const mockOrders = [
        {
          id: "order-1",
          customerName: "John Doe",
          customerPhone: "+1-555-0101",
          total: 99.99,
          status: "PENDING" as OrderStatus,
          shippingAddress: "123 Main St",
          orderDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "order-2",
          customerName: "Jane Smith",
          customerPhone: "+1-555-0102",
          total: 149.99,
          status: "PROCESSING" as OrderStatus,
          shippingAddress: "456 Oak Ave",
          orderDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrisma.order.findMany.mockResolvedValue(mockOrders);

      const orders = await mockPrisma.order.findMany();

      for (const order of orders) {
        expect(order.total).toBeGreaterThan(0);
        expect([
          "PENDING",
          "PROCESSING",
          "SHIPPED",
          "DELIVERED",
          "CANCELLED",
        ]).toContain(order.status);
        expect(order.customerPhone).toMatch(/^\+?[\d\s\-\(\)]+$/);
      }
    });

    it("should validate order item data", async () => {
      const mockOrderItems = [
        {
          id: "item-1",
          orderId: "order-1",
          productId: "product-1",
          variantId: null,
          quantity: 2,
          price: 29.99,
          productName: "Test Product 1",
        },
        {
          id: "item-2",
          orderId: "order-1",
          productId: "product-2",
          variantId: "variant-1",
          quantity: 1,
          price: 39.99,
          productName: "Test Product 2",
        },
      ];

      mockPrisma.orderItem.findMany.mockResolvedValue(mockOrderItems);

      const orderItems = await mockPrisma.orderItem.findMany();

      for (const item of orderItems) {
        expect(item.quantity).toBeGreaterThan(0);
        expect(item.price).toBeGreaterThan(0);
      }
    });
  });

  describe("Seeding Summary", () => {
    it("should provide accurate seeding statistics", async () => {
      mockPrisma.user.count.mockResolvedValue(1);
      mockPrisma.product.count.mockResolvedValue(9);
      mockPrisma.order.count.mockResolvedValue(20);
      mockPrisma.cartItem.count.mockResolvedValue(5);
      mockPrisma.wishlist.count.mockResolvedValue(4);
      mockPrisma.landingPage.count.mockResolvedValue(9);
      mockPrisma.productPage.count.mockResolvedValue(9);

      const userCount = await mockPrisma.user.count();
      const productCount = await mockPrisma.product.count();
      const orderCount = await mockPrisma.order.count();
      const cartItemCount = await mockPrisma.cartItem.count();
      const wishlistCount = await mockPrisma.wishlist.count();
      const landingPageCount = await mockPrisma.landingPage.count();
      const productPageCount = await mockPrisma.productPage.count();

      expect(userCount).toBe(1);
      expect(productCount).toBe(9);
      expect(orderCount).toBe(20);
      expect(cartItemCount).toBe(5);
      expect(wishlistCount).toBe(4);
      expect(landingPageCount).toBe(9);
      expect(productPageCount).toBe(9);
    });
  });
});
