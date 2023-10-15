import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpInputDto, SignUpInputSchema } from 'auth/dto/inputs/signup.dto';
import { AuthModel } from 'auth/dto/models/auth.model.dto';
import { LoginInputDto, LoginInputSchema } from 'auth/dto/inputs/login.dto';
import { ZodPipe } from 'pipes/zod.pipe';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('/signup')
  @ApiBody({ type: SignUpInputDto, description: 'User creation payload' })
  @ApiResponse({
    status: 200,
    description: 'La liste des utilisateurs a été récupérée avec succès.',
    type: AuthModel
  })
  @UsePipes(new ZodPipe(SignUpInputSchema))
  signUp(@Body() input: SignUpInputDto): Promise<AuthModel> {
    return this.authService.signUp(input);
  }

  @Post('/login')
  @UsePipes(new ZodPipe(LoginInputSchema))
  @ApiBody({ type: LoginInputDto, description: 'User login' })
  @ApiResponse({
    status: 200,
    type: AuthModel
  })
  login(@Body() input: LoginInputDto): Promise<AuthModel> {
    return this.authService.login(input);
  }
}
