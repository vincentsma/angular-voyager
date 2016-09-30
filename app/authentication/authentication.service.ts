/**
 * Created by Vincent on 9/17/2016.
 */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';
import { myConfig } from './authentication.config';

declare var Auth0Lock: any;

@Injectable()
export class AuthenticationService {
    lock = new Auth0Lock(myConfig.clientID, myConfig.domain, myConfig.options);
    userProfile: Object;

    constructor(private _router: Router) {
        this.userProfile = JSON.parse(localStorage.getItem('profile'));

        this.lock.on("authenticated", (authResult) => {
            localStorage.setItem('id_token', authResult.idToken);

            this.lock.getProfile(authResult.idToken, (error, profile) => {
                if (error) {
                    // Handle error
                    alert(error);
                    return;
                }

                profile.user_metadata = profile.user_metadata || {};
                localStorage.setItem('profile', JSON.stringify(profile));
                this.userProfile = profile;
            });
        });
    }

    public signIn() {
        this.lock.show();
    };

    public authenticated() {
        return tokenNotExpired();
    };

    public signOut() {
        localStorage.removeItem('id_token');
    };

    public getToken() {
        return localStorage.getItem('id_token') ? localStorage.getItem('id_token') : "";
    }
}