import {
  IsEmail,
  IsString,
  MinLength,
  Matches,
  MaxLength,
  IsInt
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  email: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores.',
  })
  username: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/,
    {
      message:
        'Password must be 8–15 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character',
    })
  password: string;

  @IsInt()
  role_id: number;
}
