import prisma from "../prisma/client";
import {ServiceError, ServiceErrorCode} from "../utils/errors/ServiceErrors";
import church from "../routes/church";

export const listLocations = async (page: number): Promise<any> => {
    try {


        const skip = (page*80) > 80?  (page*80)-((page-1)*80) : 0;
        const locations = await prisma.churchLocations.findMany(
            {
                take:(page*10)+70,
                skip: skip
            }
        );

        return  locations;
    } catch (error) {
        if (error instanceof ServiceError) {
            switch (error.code) {
                case ServiceErrorCode.LOCATION_NOT_FOUND:
                    throw new ServiceError(error.message, ServiceErrorCode.LOCATION_NOT_FOUND, 500)
                case ServiceErrorCode.LIMIT_EXCEEDED:
                    throw new ServiceError("MAX LIMIT EXCEEDED", ServiceErrorCode.LIMIT_EXCEEDED, 416)
            }
        } else {
            throw error;
        }
    }
}
export const searchLocation = async (searchString: string | undefined): Promise<any> => {
    try {
        if (!searchString) {
            throw new ServiceError("Search String is required", ServiceErrorCode.NO_PARAM_ERROR,400)
        }
        const locations = await prisma.churchLocations.findMany({
            where: {city: searchString}
        });

        return locations;
    }  catch (error) {
        console.log(error)
        if (error instanceof ServiceError) {
            switch (error.code) {
                case ServiceErrorCode.LOCATION_NOT_FOUND:
                    throw new ServiceError(error.message,ServiceErrorCode.LOCATION_NOT_FOUND ,500);
                case ServiceErrorCode.NO_PARAM_ERROR:
                    throw new ServiceError(error.message,ServiceErrorCode.NO_PARAM_ERROR,400)
            }

        } else {
            throw error;
        }
    }
}