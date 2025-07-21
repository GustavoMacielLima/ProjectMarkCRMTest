export class ListUserDto {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly email: string,
    readonly role: string,
  ) {}
}
