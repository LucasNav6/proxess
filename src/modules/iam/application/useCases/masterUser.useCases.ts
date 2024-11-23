import { IMasterUser } from '../../infraestructure/persistence/drizzle/masterUser.schema';
import { MasterUserRepository } from '../../infraestructure/persistence/repository/masterUser.repository';

export class MasterUserUseCases {
  constructor(private readonly masterUserRepository: MasterUserRepository) {}

  async getByEmail(email: string): Promise<IMasterUser[]> {
    return await this.masterUserRepository.getByEmail(email);
  }
}
