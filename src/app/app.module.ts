import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AboutComponent } from './about/about.component';
import { MatTabsModule } from '@angular/material/tabs';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { metaReducers, reducers } from './reducers';

import {
    MatButtonToggleModule,
    MatDatepickerModule,
    MatDialogModule,
    MatInputModule,
    MatListModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSidenavModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule
} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { AngularFireModule } from '@angular/fire';

import { environment } from '../environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import {
    CovalentCommonModule,
    CovalentExpansionPanelModule,
    CovalentLayoutModule,
    CovalentMediaModule,
    CovalentMenuModule,
    CovalentSearchModule
} from '@covalent/core';
import { CovalentHttpModule } from '@covalent/http';
import { SidePanelComponent } from './side-panel/side-panel.component';
import { ChannelsComponent } from './channels/channels.component';
import { DirectMessagesComponent } from './direct-messages/direct-messages.component';
import { StarredComponent } from './starred/starred.component';
import { UserPanelComponent } from './user-panel/user-panel.component';
import { MessagesComponent } from './messages/messages.component';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { CustomSerializer } from './shared/utils';
import { AuthModule } from './auth/auth.module';
import { InfoBarComponent } from './info-bar/info-bar.component';
import { MessageFormComponent } from './message-form/message-form.component';
import { ChannelDialogComponent } from './channel-dialog/channel-dialog.component';
import { channelsReducer } from './shared/reducers/channel.reducers';
import { ChannelsEffects } from './shared/effects/channels.effects';
import { userChannelsReducer } from './shared/reducers/user-channel.reducers';
import { UserChannelsEffects } from './shared/effects/user-channels.effects';
import { ChannelSearchDialogComponent } from './channel-search-dialog/channel-search-dialog.component';
import { usersReducer } from './shared/reducers/user.reducers';
import { UserEffects } from './shared/effects/user.effects';
import { MessageEffects } from './shared/effects/message.effects';
import { channelMessagesReducer } from './shared/reducers/channel-message.reducers';

@NgModule({
    declarations   : [
        AppComponent,
        AboutComponent,
        SidePanelComponent,
        ChannelsComponent,
        DirectMessagesComponent,
        StarredComponent,
        UserPanelComponent,
        MessagesComponent,
        InfoBarComponent,
        MessageFormComponent,
        ChannelDialogComponent,
        ChannelSearchDialogComponent
    ],
    imports        : [
        BrowserModule,
        BrowserAnimationsModule,
        MatMenuModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatTabsModule,
        MatSidenavModule,
        MatListModule,
        MatToolbarModule,
        MatInputModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatDialogModule,
        AppRoutingModule,
        MatSelectModule,
        MatDatepickerModule,
        MatMomentDateModule,
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFirestoreModule,
        AngularFireStorageModule,
        CovalentLayoutModule,
        CovalentSearchModule,
        CovalentMediaModule,
        CovalentMenuModule,
        CovalentCommonModule,
        CovalentHttpModule.forRoot(),
        CovalentExpansionPanelModule,
        MatButtonToggleModule,
        AuthModule.forRoot(),
        StoreModule.forRoot(reducers, {metaReducers}),
        !environment.production ? StoreDevtoolsModule.instrument() : [],
        EffectsModule.forRoot([]),
        StoreRouterConnectingModule.forRoot({stateKey: 'router'}),
        StoreModule.forFeature('channels', channelsReducer),
        EffectsModule.forFeature([ChannelsEffects]),
        StoreModule.forFeature('userChannels', userChannelsReducer),
        EffectsModule.forFeature([UserChannelsEffects]),
        StoreModule.forFeature('users', usersReducer),
        EffectsModule.forFeature([UserEffects]),
        StoreModule.forFeature('channelMessages', channelMessagesReducer),
        EffectsModule.forFeature([MessageEffects])
    ],
    providers      : [
        {provide: RouterStateSerializer, useClass: CustomSerializer}
    ],
    bootstrap      : [AppComponent],
    entryComponents: [ChannelSearchDialogComponent, ChannelDialogComponent]
})
export class AppModule {
}
