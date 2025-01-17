/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NiFiCommon } from '../../../service/nifi-common.service';
import { MatTabsModule } from '@angular/material/tabs';
import { Attribute, ProvenanceEvent, ProvenanceEventDialogRequest } from '../../../state/shared';

@Component({
    selector: 'provenance-event-dialog',
    standalone: true,
    templateUrl: './provenance-event-dialog.component.html',
    imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatInputModule,
        MatCheckboxModule,
        MatButtonModule,
        NgIf,
        AsyncPipe,
        NgForOf,
        MatDatepickerModule,
        MatTabsModule,
        NgTemplateOutlet,
        FormsModule
    ],
    styleUrls: ['./provenance-event-dialog.component.scss']
})
export class ProvenanceEventDialog {
    @Input() contentViewerAvailable!: boolean;

    @Output() downloadContent: EventEmitter<string> = new EventEmitter<string>();
    @Output() viewContent: EventEmitter<string> = new EventEmitter<string>();
    @Output() replay: EventEmitter<void> = new EventEmitter<void>();

    onlyShowModifiedAttributes: boolean = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public request: ProvenanceEventDialogRequest,
        private nifiCommon: NiFiCommon
    ) {}

    formatDurationValue(duration: number): string {
        if (duration === 0) {
            return '< 1 sec';
        }

        return this.nifiCommon.formatDuration(duration);
    }

    attributeValueChanged(attribute: Attribute): boolean {
        return attribute.value != attribute.previousValue;
    }

    shouldShowAttribute(attribute: Attribute): boolean {
        // if the attribute value has changed, show it
        if (this.attributeValueChanged(attribute)) {
            return true;
        }

        // attribute value hasn't changed, only show when
        // the user does not want to only see modified attributes
        return !this.onlyShowModifiedAttributes;
    }

    downloadContentClicked(direction: string): void {
        this.downloadContent.next(direction);
    }

    viewContentClicked(direction: string): void {
        this.viewContent.next(direction);
    }

    replayClicked(): void {
        this.replay.next();
    }
}
