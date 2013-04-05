


Step 1) Download and install HaXe 2.10 (it is fairly benign install and installs HaXe and the nekovm)

Step 2) make sure haxe is available from the command line
 % haxe                                                                                                                               
Haxe Compiler 2.10 - (c)2005-2012 Motion-Twin
 Usage : haxe -main <class> [-swf|-js|-neko|-php|-cpp|-cs|-java|-as3] <output> [options]
 Options :
  -cp <path> : add a directory to find source files
  -js <file> : compile code to JavaScript file
  -swf <file> : compile code to Flash SWF file
  -as3 <directory> : generate AS3 code into target directory
  -neko <file> : compile code to Neko Binary
  -php <directory> : generate PHP code into target directory
  -cpp <directory> : generate C++ code into target directory
  -cs <directory> : generate C# code into target directory
  -java <directory> : generate Java code into target directory
  -xml <file> : generate XML types description
  -main <class> : select startup class
  -lib <library[:version]> : use a haxelib library
  -D <var> : define a conditional compilation flag
  -v : turn on verbose mode
  -debug : add debug informations to the compiled code
  -help  Display this list of options
  --help  Display this list of options

Step 3) goto your checkout/clone of the agentui code.  For me that is cd ~/code/agentui   From there go into the client directory cd client

Step 4) build it haxe build.hxml (here is my output)

 % haxe build.hxml                                                                                                     
haxe_src/ui/widget/LabelTree.hx:20: lines 20-69 : Warning : Warning : maybe loop in static generation of ui.widget.LabelTree

and then the pudding

 % ls -alp js/AgentUi.js                                                 
-rw-r--r--  1 glen  staff  247340 Mar 16 08:45 js/AgentUi.js



Things to note...

* Currently the client folder is the actual docroot so you can copy that to a web server and point your browser to agentui.html and have a running client
* Where can we share tidbits like this, do we have a wiki or a mailing list?
* We will be upgrading to HaXe 3.0 and will let y'all know when that happens and provide instructions at the point as to how to upgrade
* If the build fails the  js/AgentUi.js is deleted.  So after running the build the existence of js/AgentUi.js is the best inidicator of success|failure
* We currently have people building and developing using HaXe on windows, max osx and linux.
* I think everyone's favorite dev environment is sublime http://www.sublimetext.com/ 
* We do have a unit test framework with unit tests on many of these components, it is just in another set of projects (and there is more plumbing since we run our unit tests in a browser over http, we have just found it better to test as close to the metal as possible)

