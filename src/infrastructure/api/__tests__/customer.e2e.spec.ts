import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for Customer API", () => {

    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a customer", async () => {
        const response = await request(app)
            .post("/customer")
            .send({
                name: "John Doe",
                address: {
                    street: "Main St",
                    city: "Springfield",
                    number: 123,
                    zip: "62701",
                },
            });
        
        expect(response.status).toBe(200);
        expect(response.body.id).toBeDefined();
        expect(response.body.name).toBe("John Doe");
        expect(response.body.address.street).toBe("Main St");
        expect(response.body.address.city).toBe("Springfield");
        expect(response.body.address.number).toBe(123);
        expect(response.body.address.zip).toBe("62701");
    });

    it("should return 500 when an error occurs while creating a customer", async () => {
        const response = await request(app)
            .post("/customer")
            .send({
                name: "John Doe",
                address: {
                    street: "Main St",
                    city: "Springfield",
                    number: 123,
                },
            });
        
        expect(response.status).toBe(500);
    });

    it("should list all customers", async () => {
        const response = await request(app)
            .post("/customer")
            .send({
                name: "John Doe",
                address: {
                    street: "Main St",
                    city: "Springfield",
                    number: 123,
                    zip: "62701",
                },
            });
        
        expect(response.status).toBe(200);
        
        const response2 = await request(app)
            .post("/customer")
            .send({
                name: "Jane Doe",
                address: {
                    street: "Second St",
                    city: "Springfield",
                    number: 567,
                    zip: "12456",
                },
            });
        
        expect(response2.status).toBe(200);

        const listResponse = await request(app).get("/customer").send();

        expect(listResponse.status).toBe(200);
        expect(listResponse.body.customers.length).toBe(2);
        const customer1 = listResponse.body.customers[0];
        expect(customer1.id).toBeDefined();
        expect(customer1.name).toBe("John Doe");
        expect(customer1.address.street).toBe("Main St");
        expect(customer1.address.city).toBe("Springfield");
        expect(customer1.address.number).toBe(123);
        expect(customer1.address.zip).toBe("62701");
        const customer2 = listResponse.body.customers[1];
        expect(customer2.id).toBeDefined();
        expect(customer2.name).toBe("Jane Doe");
        expect(customer2.address.street).toBe("Second St");
        expect(customer2.address.city).toBe("Springfield");
        expect(customer2.address.number).toBe(567);
        expect(customer2.address.zip).toBe("12456");
    });
});