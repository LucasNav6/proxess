import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';

export const DTOValidationPipes = new ValidationPipe({
  exceptionFactory: (errors) => {
    // Puedes formatear el error aquí según tus necesidades
    const messages = errors.map(
      (err) => `${err.property}: ${Object.values(err.constraints).join(', ')}`,
    );
    return new HttpException(
      {
        statusCode: 400,
        message: messages.join(', '),
      },
      HttpStatus.BAD_REQUEST,
    );
  },
});
