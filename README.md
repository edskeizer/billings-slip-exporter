#Billings Slip Exporter for Node.JS
This piece of software lets you convert your .bex (Billings Pro export) files to .csv file. The hours of the slip wil be grouped by day and the slip comments will be concatenated in one row. 

Use with Node JS

##Installation:

Get code and install:

```bash
$ git clone git@github.com/edskeizer/billings-slip-exporter.git
$ cd billings-slip-exporter
$ npm install
```

##Usage:

Export slip to .bex file (Right click in main window -> export). Save file in same folder as this project (known issue). The name of the output file will be the name of the slip (as given in Billings Pro) + '.csv'

*Command line:*

```bash
$ node app.js --infile=path_to.bex
```

##Known issues

1. Put .bex file in same folder
2. Output of file is in same folder

## License

Billings-slip-exporter is released under the [MIT License](http://www.opensource.org/licenses/MIT).