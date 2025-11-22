import { StayType, AmenityType } from '@prisma/client';
export declare class CreateStayDto {
    title: string;
    description: string;
    type: StayType;
    pricePerMonth: number;
    address: string;
    city: string;
    state: string;
    country: string;
    latitude?: number;
    longitude?: number;
    maxOccupants: number;
    availableFrom: string;
    availableTo?: string;
    amenities?: AmenityType[];
    houseRules?: string;
    cancellationPolicy?: string;
    checkInTime?: string;
    checkOutTime?: string;
    isAvailable?: boolean;
}
