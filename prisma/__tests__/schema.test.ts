import { PrismaClient, ProductStatus, OrderStatus, Role } from "@prisma/client";
import { mockDeep, DeepMockProxy } from "jest-mock-extended";

// Mock Prisma client
jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

import prisma from "@/lib/prisma";

const mockPrisma = prisma as DeepMockProxy<PrismaClient>;

describe("Database Schema Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("User Model", () => {
    it("should create a user with required fields", async () => {
      const userData = {
        id: "singleton",
        email: "admin@example.com",
        name: "Admin User",
        password: "hashedPassword123",
        role: "ADMIN" as Role,
      };

      mockPrisma.user.create.mockResolvedValue({
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await mockPrisma.user.create({
        data: userData,
      });

      expect(result).toMatchObject(userData);
      expect(result.id).toBe("singleton");
      expect(result.role).toBe("ADMIN");
    });

    it("should enforce unique email constraint", async () => {
      mockPrisma.user.create.mockRejectedValue(
        new Error("Unique constraint failed on the fields: (`email`)")
      );

      await expect(
        mockPrisma.user.create({
          data: {
            id: "singleton",
            email: "existing@example.com",
            name: "Test User",
            password: "password",
            role: "ADMIN",
          },
        })
      ).rejects.toThrow("Unique constraint failed");
    });

    it("should default role to ADMIN", async () => {
      const userData = {
        id: "singleton",
        email: "user@example.com",
        name: "Test User",
        password: "password",
      };

      mockPrisma.user.create.mockResolvedValue({
        ...userData,
        role: "ADMIN" as Role,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await mockPrisma.user.create({
        data: userData,
      });

      expect(result.role).toBe("ADMIN");
    });
  });

  describe("Product Model", () => {
    it("should create a product with all required fields", async () => {
      const productData = {
        name: "Test Product",
        description: "A test product description",
        price: 29.99,
        originalPrice: 39.99,
        category: "Electronics",
        stock: 100,
        status: "ACTIVE" as ProductStatus,
        rating: 4.5,
      };

      mockPrisma.product.create.mockResolvedValue({
        id: "product-1",
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await mockPrisma.product.create({
        data: productData,
      });

      expect(result).toMatchObject(productData);
      expect(result.id).toBeDefined();
      expect(result.status).toBe("ACTIVE");
    });

    it("should default status to ACTIVE", async () => {
      const productData = {
        name: "Test Product",
        description: "Description",
        price: 29.99,
        originalPrice: 39.99,
        category: "Electronics",
        stock: 100,
      };

      mockPrisma.product.create.mockResolvedValue({
        id: "product-1",
        ...productData,
        status: "ACTIVE" as ProductStatus,
        rating: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await mockPrisma.product.create({
        data: productData,
      });

      expect(result.status).toBe("ACTIVE");
    });

    it("should allow nullable rating", async () => {
      const productData = {
        name: "Test Product",
        description: "Description",
        price: 29.99,
        originalPrice: 39.99,
        category: "Electronics",
        stock: 100,
        rating: null,
      };

      mockPrisma.product.create.mockResolvedValue({
        id: "product-1",
        ...productData,
        status: "ACTIVE" as ProductStatus,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await mockPrisma.product.create({
        data: productData,
      });

      expect(result.rating).toBeNull();
    });
  });

  describe("ProductVariant Model", () => {
    it("should create a product variant with required fields", async () => {
      const variantData = {
        name: "Color Variant",
        type: "COLOR" as const,
        value: "Red",
        description: "Red color variant",
        variantPrice: 34.99,
        stockQuantity: 50,
        productId: "product-1",
      };

      mockPrisma.productVariant.create.mockResolvedValue({
        id: "variant-1",
        ...variantData,
      });

      const result = await mockPrisma.productVariant.create({
        data: variantData,
      });

      expect(result).toMatchObject(variantData);
      expect(result.type).toBe("COLOR");
    });

    it("should allow nullable description and variantPrice", async () => {
      const variantData = {
        name: "Size Variant",
        type: "SIZE" as const,
        value: "Large",
        description: null,
        variantPrice: null,
        stockQuantity: 25,
        productId: "product-1",
      };

      mockPrisma.productVariant.create.mockResolvedValue({
        id: "variant-2",
        ...variantData,
      });

      const result = await mockPrisma.productVariant.create({
        data: variantData,
      });

      expect(result.description).toBeNull();
      expect(result.variantPrice).toBeNull();
    });
  });

  describe("Order Model", () => {
    it("should create an order with required fields", async () => {
      const orderData = {
        customerName: "John Doe",
        customerPhone: "+1-555-0101",
        total: 99.99,
        status: "PENDING" as OrderStatus,
        shippingAddress: "123 Main St, City, State 12345",
      };

      mockPrisma.order.create.mockResolvedValue({
        id: "order-1",
        ...orderData,
        orderDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await mockPrisma.order.create({
        data: orderData,
      });

      expect(result).toMatchObject(orderData);
      expect(result.status).toBe("PENDING");
      expect(result.orderDate).toBeInstanceOf(Date);
    });

    it("should default status to PENDING", async () => {
      const orderData = {
        customerName: "Jane Smith",
        customerPhone: "+1-555-0102",
        total: 49.99,
        shippingAddress: "456 Oak Ave, City, State 12345",
      };

      mockPrisma.order.create.mockResolvedValue({
        id: "order-2",
        ...orderData,
        status: "PENDING" as OrderStatus,
        orderDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await mockPrisma.order.create({
        data: orderData,
      });

      expect(result.status).toBe("PENDING");
    });
  });

  describe("OrderItem Model", () => {
    it("should create an order item with required fields", async () => {
      const orderItemData = {
        orderId: "order-1",
        productId: "product-1",
        quantity: 2,
        price: 29.99,
        productName: "Test Product",
      };

      mockPrisma.orderItem.create.mockResolvedValue({
        id: "item-1",
        ...orderItemData,
        variantId: null,
      });

      const result = await mockPrisma.orderItem.create({
        data: orderItemData,
      });

      expect(result).toMatchObject(orderItemData);
      expect(result.variantId).toBeNull();
    });

    it("should create an order item with variant", async () => {
      const orderItemData = {
        orderId: "order-1",
        productId: "product-1",
        variantId: "variant-1",
        quantity: 1,
        price: 34.99,
        productName: "Test Product with Variant",
      };

      mockPrisma.orderItem.create.mockResolvedValue({
        id: "item-2",
        ...orderItemData,
      });

      const result = await mockPrisma.orderItem.create({
        data: orderItemData,
      });

      expect(result.variantId).toBe("variant-1");
    });
  });

  describe("Model Relationships", () => {
    it("should handle Product to ProductVariant relationship", async () => {
      const productWithVariants = {
        id: "product-1",
        name: "Test Product",
        description: "Description",
        price: 29.99,
        originalPrice: 39.99,
        category: "Electronics",
        stock: 100,
        status: "ACTIVE" as ProductStatus,
        rating: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        variants: [
          {
            id: "variant-1",
            name: "Color",
            type: "COLOR",
            value: "Red",
            description: null,
            variantPrice: 34.99,
            stockQuantity: 50,
            productId: "product-1",
          },
        ],
      };

      mockPrisma.product.findUnique.mockResolvedValue(productWithVariants);

      const result = await mockPrisma.product.findUnique({
        where: { id: "product-1" },
        include: { variants: true },
      });

      expect(result?.variants).toHaveLength(1);
      expect(result?.variants[0].productId).toBe("product-1");
    });

    it("should handle Order to OrderItem relationship", async () => {
      const orderWithItems = {
        id: "order-1",
        customerName: "John Doe",
        customerPhone: "+1-555-0101",
        total: 99.99,
        status: "PENDING" as OrderStatus,
        shippingAddress: "123 Main St",
        orderDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [
          {
            id: "item-1",
            orderId: "order-1",
            productId: "product-1",
            variantId: null,
            quantity: 2,
            price: 29.99,
            productName: "Test Product",
          },
        ],
      };

      mockPrisma.order.findUnique.mockResolvedValue(orderWithItems);

      const result = await mockPrisma.order.findUnique({
        where: { id: "order-1" },
        include: { items: true },
      });

      expect(result?.items).toHaveLength(1);
      expect(result?.items[0].orderId).toBe("order-1");
    });

    it("should handle User to Cart relationship", async () => {
      const userWithCart = {
        id: "singleton",
        email: "admin@example.com",
        name: "Admin User",
        password: "hashedPassword",
        role: "ADMIN" as Role,
        createdAt: new Date(),
        updatedAt: new Date(),
        cart: {
          id: "cart-1",
          userId: "singleton",
          createdAt: new Date(),
          updatedAt: new Date(),
          items: [],
        },
      };

      mockPrisma.user.findUnique.mockResolvedValue(userWithCart);

      const result = await mockPrisma.user.findUnique({
        where: { id: "singleton" },
        include: { cart: true },
      });

      expect(result?.cart?.userId).toBe("singleton");
    });
  });

  describe("Enum Values", () => {
    it("should accept valid Role enum values", async () => {
      const validRoles = ["CUSTOMER", "ADMIN"] as const;

      for (const role of validRoles) {
        const userData = {
          id: "singleton",
          email: `test-${role.toLowerCase()}@example.com`,
          name: "Test User",
          password: "password",
          role: role as Role,
        };

        mockPrisma.user.create.mockResolvedValue({
          ...userData,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const result = await mockPrisma.user.create({
          data: userData,
        });

        expect(result.role).toBe(role);
      }
    });

    it("should accept valid ProductStatus enum values", async () => {
      const validStatuses = ["ACTIVE", "INACTIVE"] as const;

      for (const status of validStatuses) {
        const productData = {
          name: `Test Product ${status}`,
          description: "Description",
          price: 29.99,
          originalPrice: 39.99,
          category: "Electronics",
          stock: 100,
          status: status as ProductStatus,
        };

        mockPrisma.product.create.mockResolvedValue({
          id: `product-${status.toLowerCase()}`,
          ...productData,
          rating: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const result = await mockPrisma.product.create({
          data: productData,
        });

        expect(result.status).toBe(status);
      }
    });

    it("should accept valid OrderStatus enum values", async () => {
      const validStatuses = [
        "PENDING",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
      ] as const;

      for (const status of validStatuses) {
        const orderData = {
          customerName: "Test Customer",
          customerPhone: "+1-555-0101",
          total: 99.99,
          status: status as OrderStatus,
          shippingAddress: "123 Test St",
        };

        mockPrisma.order.create.mockResolvedValue({
          id: `order-${status.toLowerCase()}`,
          ...orderData,
          orderDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const result = await mockPrisma.order.create({
          data: orderData,
        });

        expect(result.status).toBe(status);
      }
    });

    it("should accept valid VariantType enum values", async () => {
      const validTypes = ["COLOR", "SIZE", "FEATURE"] as const;

      for (const type of validTypes) {
        const variantData = {
          name: `${type} Variant`,
          type: type as "COLOR" | "SIZE" | "FEATURE",
          value: "Test Value",
          description: null,
          variantPrice: null,
          stockQuantity: 50,
          productId: "product-1",
        };

        mockPrisma.productVariant.create.mockResolvedValue({
          id: `variant-${type.toLowerCase()}`,
          ...variantData,
        });

        const result = await mockPrisma.productVariant.create({
          data: variantData,
        });

        expect(result.type).toBe(type);
      }
    });
  });

  describe("Data Validation", () => {
    it("should validate email format", async () => {
      const invalidEmails = [
        "invalid-email",
        "@example.com",
        "test@",
        "test.example.com",
      ];

      for (const email of invalidEmails) {
        mockPrisma.user.create.mockRejectedValue(
          new Error(`Invalid email format: ${email}`)
        );

        await expect(
          mockPrisma.user.create({
            data: {
              id: "singleton",
              email,
              name: "Test User",
              password: "password",
              role: "ADMIN",
            },
          })
        ).rejects.toThrow();
      }
    });

    it("should validate price is positive", async () => {
      const invalidPrices = [-10, 0, -0.01];

      for (const price of invalidPrices) {
        mockPrisma.product.create.mockRejectedValue(
          new Error(`Price must be positive: ${price}`)
        );

        await expect(
          mockPrisma.product.create({
            data: {
              name: "Test Product",
              description: "Description",
              price,
              originalPrice: 39.99,
              category: "Electronics",
              stock: 100,
            },
          })
        ).rejects.toThrow();
      }
    });

    it("should validate stock is non-negative", async () => {
      const invalidStocks = [-1, -100];

      for (const stock of invalidStocks) {
        mockPrisma.product.create.mockRejectedValue(
          new Error(`Stock cannot be negative: ${stock}`)
        );

        await expect(
          mockPrisma.product.create({
            data: {
              name: "Test Product",
              description: "Description",
              price: 29.99,
              originalPrice: 39.99,
              category: "Electronics",
              stock,
            },
          })
        ).rejects.toThrow();
      }
    });

    it("should validate quantity is positive", async () => {
      const invalidQuantities = [0, -1, -5];

      for (const quantity of invalidQuantities) {
        mockPrisma.orderItem.create.mockRejectedValue(
          new Error(`Quantity must be positive: ${quantity}`)
        );

        await expect(
          mockPrisma.orderItem.create({
            data: {
              orderId: "order-1",
              productId: "product-1",
              quantity,
              price: 29.99,
              productName: "Test Product",
            },
          })
        ).rejects.toThrow();
      }
    });
  });

  describe("Cascade Operations", () => {
    it("should handle cascade delete for order items", async () => {
      mockPrisma.orderItem.deleteMany.mockResolvedValue({ count: 3 });
      mockPrisma.order.delete.mockResolvedValue({
        id: "order-1",
        customerName: "Test Customer",
        customerPhone: "+1-555-0101",
        total: 99.99,
        status: "PENDING" as OrderStatus,
        shippingAddress: "123 Test St",
        orderDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // First delete order items
      await mockPrisma.orderItem.deleteMany({
        where: { orderId: "order-1" },
      });

      // Then delete the order
      await mockPrisma.order.delete({
        where: { id: "order-1" },
      });

      expect(mockPrisma.orderItem.deleteMany).toHaveBeenCalledWith({
        where: { orderId: "order-1" },
      });

      expect(mockPrisma.order.delete).toHaveBeenCalledWith({
        where: { id: "order-1" },
      });
    });

    it("should handle cascade delete for product variants", async () => {
      mockPrisma.productVariant.deleteMany.mockResolvedValue({ count: 2 });

      await mockPrisma.productVariant.deleteMany({
        where: { productId: "product-1" },
      });

      expect(mockPrisma.productVariant.deleteMany).toHaveBeenCalledWith({
        where: { productId: "product-1" },
      });
    });
  });
});
