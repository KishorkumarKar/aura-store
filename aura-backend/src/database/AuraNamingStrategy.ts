import { DefaultNamingStrategy, NamingStrategyInterface } from "typeorm";

export class AuraNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface
{
  tableName(targetName: string, userSpecifiedName?: string): string {
    return `aura_${userSpecifiedName ?? targetName}`;
  }
}