import { BadRequestException } from "@nestjs/common";

export class ValidationsHelpers {
    static async externalIdUniqueValidation(documents: any) : Promise<any> {
        for await (const _ of documents) {
            throw new BadRequestException(
                'Something bad happened', {
                    cause: new Error(), description: 'external_id already exists'
                }
            )
        }
    }
}
