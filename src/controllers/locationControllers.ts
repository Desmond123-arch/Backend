import {Request, Response} from "express";
import {listLocations, searchLocation} from "../services/locationService";
import {ServiceError, ServiceErrorCode} from "../utils/errors/ServiceErrors";
import prisma from "../prisma/client";


export const ListLocation = async  (req: Request, res: Response): Promise<any> => {
    let page: number = Number(req.query.page) || 0;
    let next:string | null;
    try {
        const count = await  prisma.churchLocations.count();

        if (page*80 > count ) {
            next = null;
            return res.status(416).json({ error: "Max limit exceeded" });
        } else if ((page+1)*80 > count ) {
            next = null;
        }
        else {
            next = `${req.protocol}://${req.get('host')}/page=${page+1}`
        }
        const locations = await listLocations(page);
        return res.status(200).json(
            {
                locations: locations,
                next: next
            }
        );
    } catch (err) {
        console.log(err);
        if (err instanceof ServiceError && err.code === ServiceErrorCode.LOCATION_NOT_FOUND) {
            return res.status(400).json({error: "Location not found"})
        } else {
            return res.status(500).json({ "error": "Internal Server Error" })
        }
    }
}

export const SearchLocations = async (req: Request, res: Response): Promise<any> => {
    const value = req.query.location as string;
    if (!value) {
        return res.status(400).json({ error: "Location is required" })
    }
    try {
        const foundLocations = await  searchLocation(value);
        console.log(foundLocations);
        return res.status(200).json({locations: foundLocations});
    } catch (error) {
        if (error instanceof ServiceError)
        {
            switch (error.code) {
                case ServiceErrorCode.LOCATION_NOT_FOUND:
                    throw new ServiceError(error.message,ServiceErrorCode.LOCATION_NOT_FOUND ,500);
                case ServiceErrorCode.NO_PARAM_ERROR:
                    throw new ServiceError(error.message,ServiceErrorCode.NO_PARAM_ERROR,400)
            }
        } else {
            console.log(error);
            return res.status(500).json({error: "Internal Server Error"});
        }
    }
}