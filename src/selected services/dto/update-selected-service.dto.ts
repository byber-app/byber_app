import { PartialType } from "@nestjs/mapped-types";
import { CreateSelectedServiceDto } from "./create-selected-service.dto";

export class UpdateSelectedServiceDto extends PartialType(CreateSelectedServiceDto) { }
