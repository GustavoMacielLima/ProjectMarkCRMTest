export class ListUserDto {
  constructor(
    readonly id: string,
    readonly fullName: string,
    readonly email: string,
    readonly phone: string,
    readonly role: string,
    readonly isActive: boolean,
    readonly identifier: string,
  ) {}
}
