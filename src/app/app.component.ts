import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './_services';
import { User, Role } from './_models';
import * as AWS from 'aws-sdk';
import * as localJSON from './../assets/properties/properties.json'

declare var TextDecoder;
@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent implements OnInit{
    user: User;
    propertiesFromS3;
    propertiesFromLocal;

    constructor(private authenticationService: AuthenticationService) {
        this.authenticationService.user.subscribe(x => this.user = x);
    }

    ngOnInit() {
      // Set up credentials
      this.fetchPropertiesS3();
      this.fetchLocalProperties();
      setTimeout(()=>{
      console.log(this.propertiesFromS3);
      console.log(this.propertiesFromLocal);
      },3000);



    }
    fetchLocalProperties() {
      this.propertiesFromLocal=localJSON['default'];
    }

    async fetchPropertiesS3(){
      AWS.config.credentials = new AWS.Credentials({
        accessKeyId: 'AKIAWIGXM4F44L66A72S', secretAccessKey: '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'
      });

      const params = {
        Bucket: 'testbucket20211112',
        Key: 'properties.json'
      };

      let s3 = new AWS.S3();
      // s3.getObject(params).promise
      this.propertiesFromS3 = JSON.parse((await (s3.getObject(params).promise())).Body.toString('utf-8'))

      // this.propertiesFromS3= s3.getObject(params, function(err, data) {
      //   if (err) {
      //     console.log(err); // an error occurred
      //   } else {
      //     // var string = new TextDecoder('utf-8').decode(data.Body);
      //     // console.log(string);
      //     return new TextDecoder('utf-8').decode(data.Body);
      //   }
      // });

    }

    get isAdmin() {
        return this.user && this.user.role === Role.Admin;
    }

    logout() {
        this.authenticationService.logout();
    }
}
