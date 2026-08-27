// @ts-ignore
import { describe, expect, it } from "bun:test";
import { getTransportLocationDisplay, sanitizeJobContainersForShipment } from "./airFreightJob";

describe("sanitizeJobContainersForShipment", () => {
  it("removes container fields for AIR jobs while keeping cargo details and DG flag", () => {
    const containers = sanitizeJobContainersForShipment({
      serviceType: "OCEAN",
      shipmentType: "AIR",
      containers: [
        {
          containerNumber: "TEMU1234567",
          sealNumber: "SN123456",
          containerTypeId: "40HC",
          isHazardous: true,
          items: [
            {
              sequenceNo: 1,
              qty: 2,
              packageTypeCode: "PKGS",
              grossWeight: 100,
              netWeight: 90,
              measurementCbm: 1.5,
              description: "AIR FREIGHT",
              hsCode: "123456",
            },
          ],
        },
      ],
    });

    expect(containers).toEqual([
      {
        containerNumber: null,
        sealNumber: null,
        containerTypeId: null,
        vehicleNumber: null,
        driverName: null,
        driverContactNumber: null,
        isHazardous: true,
        items: [
          {
            sequenceNo: 1,
            qty: 2,
            packageTypeCode: "PKGS",
            grossWeight: 100,
            netWeight: 90,
            measurementCbm: 1.5,
            description: "AIR FREIGHT",
            hsCode: "123456",
          },
        ],
      },
    ]);
  });
});

describe("getTransportLocationDisplay", () => {
  it("uses IATA/location code for AIR printouts", () => {
    expect(
      getTransportLocationDisplay({
        serviceType: "OCEAN",
        shipmentType: "AIR",
        code: "CGK",
        name: "SOEKARNO HATTA, JAKARTA",
      }),
    ).toBe("CGK");
  });

  it("uses full port name for ocean printouts", () => {
    expect(
      getTransportLocationDisplay({
        serviceType: "OCEAN",
        shipmentType: "OCEAN",
        code: "IDBLW",
        name: "BELAWAN, SUMATRA, INDONESIA",
      }),
    ).toBe("BELAWAN, SUMATRA, INDONESIA");
  });
});
