import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PdvStatusEnum, ProviderEnum } from 'src/models/pdv.model';

export class CreatePdvDto {
  @IsEnum(ProviderEnum, { message: 'INVALID_NAME' })
  @IsNotEmpty({ message: 'REQUIRED_NAME' })
  provider: ProviderEnum;

  @IsEnum(PdvStatusEnum, { message: 'INVALID_STATUS' })
  @IsNotEmpty({ message: 'REQUIRED_STATUS' })
  status: PdvStatusEnum;

  @IsNotEmpty({ message: 'REQUIRED_SERIAL_NUMBER' })
  serialNumber: string;

  @IsNotEmpty({ message: 'REQUIRED_CONTRACT_ID' })
  contractId: number;

  @IsString()
  @IsNotEmpty({ message: 'REQUIRED_COMPANY_ID' })
  companyId: string;
}
