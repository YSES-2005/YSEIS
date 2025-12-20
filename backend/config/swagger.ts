import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Young Software Engineers Inventory System API',
      version: '1.0.0',
      description:
        'API documentation for the YSEIS, a simple inventory management system.',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'The user ID',
              example: '60f7b3b3b3b3b3b3b3b3b3b3',
            },
            name: {
              type: 'string',
              description: "The user's name",
              example: 'John Doe',
            },
            email: {
              type: 'string',
              description: "The user's email address",
              example: 'user@example.com',
            },
            role: {
              type: 'string',
              enum: ['admin', 'user'],
              description: "The user's role",
              example: 'user',
            },
            avatar: {
              type: 'string',
              description: "URL to the user's avatar image",
              example: 'https://example.com/avatar.png',
            },
            urgent_borrow_uses: {
              type: 'number',
              description: 'Number of urgent borrow uses left',
              example: 0,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'The timestamp of when the user was created',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'The timestamp of when the user was last updated',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./features/**/*.route.ts'], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);
