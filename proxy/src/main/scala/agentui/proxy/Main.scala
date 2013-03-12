package agentui.proxy

import net.model3.servlet.runner.JettyRunner
import net.model3.logging.SimpleLoggingConfigurator




object Main extends App {
  
  new SimpleLoggingConfigurator().addEclipseConsoleAppender()
  
  JettyRunner.main(args)
  
}
