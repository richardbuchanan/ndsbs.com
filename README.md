# NDSBS
This repository is used for tracking changes in the Drupal installation for ndsbs.com and the
local/development/production environments.

## Table of Contents

1. [Introduction](#introduction)
1. [Dependencies](#dependencies)
1. [Installation](#installation)
1. [Contributing](#contributing)
1. [License](#license)


## Introduction
Although Drupal is available through version control, this repository is custom tailored for development at ndsbs.com.
The .gitignore file ignores the Drupal core files and directories, except the "sites" directory. This way we can pull
user generated files to copy into our local development environment with ease, without bloating the repository will
files and directories from Drupal core.

## Dependencies
To install and run Drupal your web server must meet certain minimum requirements. The requirements listed here target
local development, while many hosting companies provide these dependencies out-of-the-box.

### Nginx
[Nginx](http://nginx.org/) is a commonly used web server that focuses on high concurrency, performance and low memory
usage.

### MySQL
Drupal 7 supports MySQL 5.0.15 or higher, and requires the PDO database extension for PHP (see
[What is PDO?](https://www.drupal.org/requirements/pdo)).

## Installation
Installation and use of this repository in local development will mostly depend on the operating system and web server
software you prefer. We will not cover these installation steps since there are plenty of resources on the web about
installing and setting up your preferred OS and web server software.

Below are the steps to setup and install a local development environment in Ubuntu 14.04LTS using a LEMP stack (Linux,
Nginx, MySQL, PHP), which is my preferred development setup.

### 1. Create a hostname
In order to develop multiple websites locally I create a new hostname for each.
```
sudo nano /etc/hosts
```

```
127.0.0.1       localhost localhost.ndsbs localhost.rcb ...
```

"localhost.ndsbs" was added to the first line. This allows us to enter "localhost.ndsbs" in our browser for local
development of ndsbs.com. You can enter as many hostnames as you'd like, separating each with a single space.

### 2. Install Nginx
Nginx is the web server software I use locally, even though ndsbs.com uses Apache on the prodution site.
````
sudo apt-get update
sudo apt-get install nginx
````

### 3. Install MySQL
````
sudo apt-get install mysql-server
````

Tell MySQL to generate the directory structure it needs to store its databases and information.
````
sudo mysql_install_db
````

Run a simple security script that will prompt you to modify some insecure defaults.
````
sudo mysql_secure_installation
````

You will need to enter the MySQL root password that you selected during installation.

Next, it will ask if you want to change that password. If you are happy with your MySQL root password, type "N" for no
and hit "ENTER". Afterwards, you will be prompted to remove some test users and databases. You should just hit "ENTER"
through these prompts to remove the unsafe default settings.

Once the script has been run, MySQL is ready to go.

### 4. Install PHP
````
sudo apt-get install php5-fpm php5-mysql
````

We now have our PHP components installed, but we need to make a slight configuration change to make our setup more
secure.
````
sudo nano /etc/php5/fpm/php.ini
````

Find and uncomment the line:
````
# cgi.fix_pathinfo=1
````

and change it to:
````
cgi.fix_pathinfo=0
````

Then restart the PHP processor service:
````
sudo service php5-fpm restart
````

### 5. Download Drupal core and clone this repository
Since I use PHPStorm for all local development, the directories in the steps below will reflect the location of my
PHPStorm projects directory. Make appropriate changes based on your local development environment.

In your projects directory, download Drupal using Drush:
````
cd ~/PhpStormProjects
drush dl drupal-7.52
````

Clone this repository:
````
git clone https://github.com/richardbuchanan/ndsbs.com.git
````

You will now have this directory structure:
````
drupal-7.52/
├── includes/
├── misc/
├── modules/
├── scripts/
├── sites/
├── ...
ndsbs.com/
├── sites/
└── .../
````

Rename the Drupal directory and copy the ndsbs.com files into the Drupal directory:
````
mv drupal-7.52 NDSBS
cp -R ./ndsbs.com/* ./NDSBS/ && cp -R ./ndsbs.com/.git* ./NDSBS/
````

### 6. Configure Nginx

Create a new Nginx server block configuration file:
````
sudo nano /etc/nginx/sites-available/localhost
````

Then paste the following:
````
# localhost.ndsbs
server {
  listen 80;
  server_name localhost.ndsbs;
  root /home/richard/PhpstormProjects/NDSBS;

  access_log /home/richard/PhpstormProjects/NDSBS/sites/localhost.ndsbs/logs/access.gz combined gzip flush=5m;
  error_log /home/richard/PhpstormProjects/NDSBS/sites/localhost.ndsbs/logs/error.log warn;

  location /phpmyadmin {
    root /usr/share/;
    index index.php index.html index.htm;

    location ~ ^/phpmyadmin/(.+\.php)$ {
      try_files $uri =404;
      root /usr/share/;
      fastcgi_pass unix:/var/run/php5-fpm.sock;
      fastcgi_index index.php;
      fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
      include /etc/nginx/fastcgi_params;
    }

    location ~* ^/phpmyadmin/(.+\.(jpg|jpeg|gif|css|png|js|ico|html|xml|txt)) {
      root /usr/share/;
    }
  }

  location /phpMyAdmin {
    rewrite ^/* /phpmyadmin last;
  }

  # Prevent hidden files beginning with a period from being served.
  location ~ /\. {
    access_log off;
    log_not_found off;
    deny all;
  }

  # Prevent temporary files from being served.
  location ~ ~$ {
    access_log off;
    log_not_found off;
    deny all;
  }

  location = /favicon.ico {
    log_not_found off;
    access_log off;
  }

  location = /robots.txt {
    allow all;
    log_not_found off;
    access_log off;
  }

  # This matters if you use drush
  location = /backup {
    deny all;
  }

  # Very rarely should these ever be accessed outside of your lan
  # Our clients can upload text files, so allow access to .txt files but not .log files.
  #location ~* \.(txt|log)$ {
  location ~* \.log$ {
    deny all;
  }

  location ~ \..*/.*\.php$ {
    return 403;
  }

  location / {
    # This is cool because no php is touched for static content
    try_files $uri @rewrite;

    # Pass some headers to the downstream server, so it can identify the host.
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_redirect off;
  }

  location @rewrite {
    # Some modules enforce no slash (/) at the end of the URL
    # Else this rewrite block wouldn't be needed (GlobalRedirect)
    rewrite ^/(.*)$ /index.php?q=$1;
  }

  location ~ \.php$ {
    fastcgi_split_path_info ^(.+\.php)(/.+)$;
    include fastcgi_params;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    fastcgi_pass unix:/var/run/php5-fpm.sock;
  }

  # Fighting with ImageCache? This little gem is amazing.
  location ~ ^/sites/.*/files/imagecache/ {
    try_files $uri @rewrite;
  }

  # Catch image styles for D7 too.
  location ~ ^/sites/.*/files/styles/ {
    try_files $uri @rewrite;
  }

  location ~* \.(?:css|js|ico|woff|eot|ttf|otf|gif|jpe?g) {
    expires max;
    access_log off;
    log_not_found off;
  }

  # Add a Cache-Control: public header to png and svg files.
  location ~* \.(?:png|svg) {
    add_header Cache-Control "public";
    expires max;
    access_log off;
    log_not_found off;
  }

  # Adds the  missing vary header on zippable fonts.
  location ~* \.(?:eot|ttf|svg)$ {
    add_header Vary Accept-Encoding;
  }

  proxy_pass_header Server;

  large_client_header_buffers 8 64k;
}
````

### 7. Install and configure phpMyAdmin
phpMyAdmin makes setting up and configuring databases and MySQL users a breeze.

````
sudo apt-get install phpmyadmin
````

During the installation, you will be prompted for some information. It will ask you which web server you would like the
software to automatically configure. Since Nginx, the web server we are using, is not one of the available options, you can just hit TAB to bypass this prompt.

The next prompt will ask if you would like dbconfig-common to configure a database for phpmyadmin to use. Select "Yes"
to continue.

````
sudo ln -s /usr/share/phpmyadmin /usr/share/nginx/html
````

This allows us to go to localhost/phpmyadmin in our browser to sign into phpMyAdmin. From there I create a new database
named "ndsbs", which is the final step in setting up our local development server so we can install and setup our local
ndsbs.com website for development.

### 8. Setup Drupal for localhost.ndsbs
Now we can setup Drupal for local development of ndsbs.com.

First go to the sites directory of our local Drupal installation and copy the ndsbs.com directory into a new directory.
````
cd NDSBS/sites
cp -R ndsbs.com localhost.ndsbs
````

Then copy the default settings file.
````
cp localhost.ndsbs/default.settings.php localhost.ndsbs/settings.php
````

**[Back to top](#table-of-contents)**

## Contributing

Open an issue first to discuss potential changes/additions.

**[Back to top](#table-of-contents)**

## License

### [GNU General Public License, version 2](http://www.gnu.org/licenses/old-licenses/gpl-2.0.html)
Copyright (C) 2016 Richard C. Buchanan, III

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

**[Back to top](#table-of-contents)**
