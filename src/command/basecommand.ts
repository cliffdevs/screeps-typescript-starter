export default abstract class BaseCommand {

  public BaseCommand() {

  }

  abstract run(commandOptions: CommandConfig): void;
}
