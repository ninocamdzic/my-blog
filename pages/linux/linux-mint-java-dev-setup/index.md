# Setting up a Java development environment on Linux Mint (User local)
<sup>Published on: %{date-published}%</sup>

In this article we will go through the steps of setting up a Java development environment in the user's home folder.

## Installing Java

1. Download the tar ball file from https://adoptium.net/download and extract the folder inside it to `~/Downloads`. You should get something like this: `~/Downloads/jdk21.0.3+9/`.

2. Now, create the folder `~/tools` and move the JDK folder to the newly created folder `mv ~/Downloads/jdk21.0.3+9 ~/tools`

## Installing Maven

1. Download the latest version from https://maven.apache.org/ and extract it into `~/Downloads`. You should get something like this: `~/Downloads/apache-maven-3.9.7`.

2. Now, move the Maven folder to the `~/tools` folder. `mv ~/Downloads/maven-apache-3.9.7 ~/tools`

## User local environment variables

1. Open the `~/.profile` file with a text editor and copy and paste the following at the bottom of the file:

```bash
export JAVA_HOME=~/tools/<jdk-folder-name>
export MAVEN_HOME=~/tools/<maven-folder-name>
PATH="$JAVA_HOME/bin:$MAVEN_HOME/bin:$PATH"
```
*Note: ~ within quotes does not work. [More info](https://stackoverflow.com/questions/32276909/why-is-a-tilde-in-a-path-not-expanded-in-a-shell-script).*

2. Replace `<jdk-folder-name>` and `<maven-folder-name>` placeholders with the correct folder names. Do not add `/` at the end.

3. Save the changes and logout and log back in.

4. Start a terminal session and try executing the following: `java -version`. Make sure the version matches your installed version. In my case it looks like this:
```
openjdk version "21.0.3" 2024-04-16 LTS
OpenJDK Runtime Environment Temurin-21.0.3+9 (build 21.0.3+9-LTS)
OpenJDK 64-Bit Server VM Temurin-21.0.3+9 (build 21.0.3+9-LTS, mixed mode, sharing)
```

5. Now, check if Maven is correctly installed. Execute the following command: `mvn -version`. Make sure the version matches your installed version. In my case it looks like this:

```
Apache Maven 3.9.7
Maven home: /home/test-user/tools/apache-maven-3.9.7
Java version: 21.0.3, vendor: Eclipse Adoptium, runtime: /home/test-user/tools/jdk-21.0.3+9
```

## Installing IntelliJ

Installing IntelliJ is almost the same process as installing Java and Maven. The only difference in this step is that there are no environment variables to be configured.

1. Download IntelliJ tar ball from https://www.jetbrains.com/idea/download and extract it again into `~/Downloads`. You should have something like this: `~/Downloads/idea-IC-241.17890.1`.

2. Now, move the IntelliJ folder to the `~/tools` folder. `mv ~/Downloads/idea-IC-241.17890.1 ~/tools`.

3. Now, you can run IntelliJ by executing `~/tools/idea-IC-241.17890.1/bin/idea.sh`. If you create a new launcher on your desktop, make sure to check the 'Launch in Terminal' box, otherwise IntelliJ will use the default JDK which is installed with Linux Mint.