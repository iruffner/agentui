package agentui.proxy

import net.model3.servlet.runner.JettyRunner
import net.model3.logging.SimpleLoggingConfigurator
import net.model3.guice.DependencyInjector




object Main extends App {

  DependencyInjector.set(new GuiceModule().get)
  
  new SimpleLoggingConfigurator().addEclipseConsoleAppender()
  
  JettyRunner.main(args)
  
}
