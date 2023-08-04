({
     setTabId: function(component, event, helper) {
                var workspaceAPI = component.find("WS_ResrvMngt");
                var tabId;
                workspaceAPI.isConsoleNavigation().then(function(isCon) {
                    console.log('[isConsoleNavigation] isCon => ', JSON.stringify(isCon));
                    workspaceAPI.getAllTabInfo().then(function(response){
                        var result = response;
                        console.log('[getAllTabInfo] result', JSON.stringify(result));
                        var tabInfo;
                        if(result.length > 0){
                            result.forEach(function(val, idx, arr){
                                console.log('[getAllTabInfo] tabInfo', JSON.stringify(val));
                                if(val.customTitle === "예약관리"){
                                    tabInfo = val;
                                }
                            });
                            if(tabInfo === undefined && result[result.length - 1].customTitle === undefined){
                                result.forEach(function(val, idx, arr){
                                    if(tabInfo === undefined && val.customTitle === undefined && (val.title.includes('Loading') || val.title.includes('로드'))){
                                        tabInfo = val;
                                    }
                                });
                            }
                            // if(tabInfo === undefined && result[result.length - 1].customTitle === undefined){
                            //     if(result[result.length - 1].title.includes('Loading') || result[result.length - 1].title.includes('로드')){
                            //         tabInfo = result[result.length - 1];
                            //     }
                            // }
                        }
                        if(tabInfo != undefined) {
                            tabId = tabInfo.tabId;
                            console.log('[tabId] tabId', tabId);
                            workspaceAPI.setTabLabel({
                                tabId: tabId,
                                label: "예약관리"
                            });
                            workspaceAPI.setTabIcon({
                                tabId: tabId,
                                icon: "standard:date_input",
                                iconAlt: "예약관리"
                            });
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });
                });


    //    setTabId: function(component, event, helper) {
    //        var workspaceAPI = component.find("WS_ResrvMngt");
    //        workspaceAPI.getFocusedTabInfo().then(function(response) {
    //            var focusedTabId = response.tabId;
    //            workspaceAPI.setTabLabel({
    //                tabId: focusedTabId,
    //                label: "예약관리"
    //            });
    //            workspaceAPI.setTabIcon({
    //                tabId: focusedTabId,
    //                icon: "standard:date_input",
    //            });
    //        });
    },

    getUserInfo: function(component, event, helper) {
        console.log('getUserInfo');
        var action = component.get('c.getUserInfo');
        console.log('action',action);
        action.setCallback(this, function (response) {
            var state = response.getState();
            console.log('state == > ', state);

            if (state === "SUCCESS") {
                var result = response.getReturnValue();
                console.log(JSON.stringify(result));

                var userCenterId = result.Location.Id;
                // var centerName = result.ServiceResource.SM_DEPT__r.Name;
                var userCenterCode = result.User.DEPT_CODE__c;
                var userCenterName = result.Location.Name;
                var userSMName = result.ServiceResource.Name;
                var userPermission;
                component.set('v.userCenterId', userCenterId);
                component.set('v.userCenterName', userCenterName);
                component.set('v.userSMName', userSMName);
                component.set('v.userCenterId', userCenterId);
                component.set('v.userSMName', userSMName);
                component.set('v.userSMcode', result.ServiceResource.fm_EmployeeNumber__c);
                component.set('v.userCenterCode', result.User.DEPT_CODE__c);
                component.set('v.userDeptCode', result.ServiceResource.SM_DEPT__r.HIGH_DEPT_CODE__r.DEPT_CODE__c);
                component.set('v.userDeptType', result.ServiceResource.SM_DEPT__r.DEPT_TYPE_SECOND__c);
                component.set('v.userSettingforSM', userSMName +'[' + component.get('v.userSMcode') + ']');

                if(Object.keys(result.PermissionSetAssignment).length !== 0){
                    console.log('권한있을때');
                    userPermission = result.PermissionSetAssignment.PermissionSet.Name;
                }else{
                    userPermission = '';
                }
                console.log('userPermission ==> ',userPermission);
                if(userPermission != 'FS_ProductItemAdmin'){
                    console.log('자재관리자 X');
                    component.set('v.userPermission',true);
                    component.set('v.mapSearchParam.smCode', component.get('v.userSMcode'));

                }else{
                    console.log('자재관리자 O');
                    component.set('v.userPermission',false);
                }
            } else {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) this.showToast("error", errors[0].message);
                } else {
                    this.showToast("error", "Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    },

    doInitDatatableSetting: function (component, event, helper) {
        console.log('doInitDatatableSetting');
        // TODO_SJ: 링크 추가 필요
        var actions = [
            {label: '바로가기1', name: 'link1'},
            {label: '바로가기2', name: 'link2'}
        ];

        // 예약관리 Datatable Columns
        let columns = [
            { type: 'checkbox', fieldName: 'isSelected', default:false},
            {
                label: '입력일시',
                fieldName: 'CreatedDate',
                type: 'Datetime',
                initialWidth: 140,
                cellAttributes: {alignment: 'center'},
                hideDefaultActions: true
            },
            {
                label: '예약자코드',
                fieldName: 'RequesterCode',
                type: 'text',
                initialWidth: 90,
                cellAttributes: {alignment: 'left'},
                hideDefaultActions: true
            },
            {
                label: '예약자',
                fieldName: 'Requester',
                type: 'text',
                initialWidth: 90,
                cellAttributes: {alignment: 'left'},
                hideDefaultActions: true
            },
            {
                label: '사업부',
                fieldName: 'DivCode',
                type: 'text',
                initialWidth: 60,
                cellAttributes: {alignment: 'Center'},
                hideDefaultActions: true
            },
            {
                label: '요청PARTNO',
                fieldName: 'requestPartNo',
                type: 'text',
                initialWidth: 107,
                cellAttributes: {alignment: 'left'},
                hideDefaultActions: true
            },
            {
                label: '입고PARTNO',
                fieldName: 'receivedPartNo',
                type: 'text',
                initialWidth: 107,
                cellAttributes: {alignment: 'left'},
                hideDefaultActions: true
            },
            {
                label: '품명',
                fieldName: 'PartDesc',
                type: 'text',
                initialWidth: 120,
                cellAttributes: {alignment: 'left'},
                hideDefaultActions: true
            },
            {
                label: '출고부서',
                fieldName: 'ShippedDepartMent',
                type: 'text',
                initialWidth: 120,
                cellAttributes: {alignment: 'left'},
                hideDefaultActions: true
            },
            {
                label: '약속상태',
                fieldName: 'ResrvStatus',
                type: 'text',
                initialWidth: 80,
                cellAttributes: {alignment: 'left'},
                hideDefaultActions: true
            },
            {
                label: '요청',
                fieldName: 'requestQuantity',
                type: 'number',
                initialWidth: 50,
                cellAttributes: {alignment: 'right'},
                hideDefaultActions: true
            },
            {
                label: '입고',
                fieldName: 'receivedQuantity',
                type: 'number',
                cellAttributes: {alignment: 'right'},
                hideDefaultActions: true
            },
            {
                label: '정리',
                fieldName: 'orgQuantity',
                type: 'number',
                initialWidth: 50,
                cellAttributes: {alignment: 'right'},
                // editable: {fieldName: 'CANCEL_Reason_Editable'},
                hideDefaultActions: true
            },
            {
                label: '상세내용',
                fieldName: 'Cancel',
                type: 'button',
                initialWidth: 70,
                typeAttributes: {name: 'BUTTON_PARTITION', iconName : { fieldName: 'button_iconName' }, disabled: { fieldName: 'button_disabled' }, variant: { fieldName: 'button_variant' }},
                cellAttributes: {alignment: 'center'},
                hideDefaultActions: true
            },
            // {
            //     label: '차용',
            //     value: 'Rent',
            //     type: 'button',
            //     initialWidth: 72,
            //     typeAttributes: {name: 'BUTTON_PARTITION', iconName : { fieldName: 'button_iconName' }, disabled: { fieldName: 'button_disabled' }, variant: { fieldName: 'button_variant' }},
            //     // typeAttributes: {
            //     //     context: {fieldName: 'prId'}, // binding account Id with context variable to be returned back
            //     //     disabled: {fieldName: 'rent_disabled'},
            //     //     label: 'isRent',
            //     //     // value: 'BUTTON_PARTITION'
            //     // },
            //     // cellAttributes: {alignment: 'center'},
            //     // hideDefaultActions: true
            // },
            {
                label: 'SM출고',
                value: 'Rent',
                type: 'checkboxColumn',
                initialWidth: 72,
                // typeAttributes: {name: 'BUTTON_PARTITION', iconName : { fieldName: 'button_iconName' }, disabled: { fieldName: 'button_disabled' }, variant: { fieldName: 'button_variant' }},
                typeAttributes: {
                    context: {fieldName: 'prId'}, // binding account Id with context variable to be returned back
                    disabled: {fieldName: 'rent_disabled'},
                    label: 'isRent',
                    value: false
                },
                cellAttributes: {alignment: 'center'},
                hideDefaultActions: true
            },
            {
                label: '접수번호',
                fieldName: 'ReceiveNumber',
                type: 'text',
                initialWidth: 100,
                cellAttributes: {alignment: 'center'},
                hideDefaultActions: true
            },
            {
                label: '약속일자',
                fieldName: 'AppointMentDate',
                type: 'Datetime',
                initialWidth: 140,
                cellAttributes: {alignment: 'center'},
                hideDefaultActions: true
            },
            {
                label: '미처리코드',
                fieldName: 'UnprocessedCode',
                type: 'text',
                initialWidth: 90,
                cellAttributes: {alignment: 'center'},
                hideDefaultActions: true
            },

            {
                label: '취소',
                value: 'Cancel',
                type: 'checkboxColumn',
                initialWidth: 72,
                typeAttributes: {
                    context: {fieldName: 'prId'}, // binding account Id with context variable to be returned back
                    disabled: {fieldName: 'cancel_disabled'},
                    label: 'isCancel',
                    // value: 'BUTTON_CANCEL'
                },
                cellAttributes: {alignment: 'left'},
                hideDefaultActions: true
            },
            {
                label: '취소사유',
                fieldName: 'CancelReason',
                type: 'text',
                initialWidth: 150,
                cellAttributes: {alignment: 'left'},
                hideDefaultActions: true,
                editable: {fieldName: 'CANCEL_Reason_Editable'},
            },
            {
                label: '실통화자',
                fieldName: 'CancelUser',
                type: 'text',
                initialWidth: 80,
                cellAttributes: {alignment: 'center'},
                hideDefaultActions: true
            },
            {
                label: 'PO취소',
                fieldName: 'AllocCancelYN',
                type: 'text',
                initialWidth: 70,
                cellAttributes: {alignment: 'center'},
                hideDefaultActions: true
            },
            {
                label: '공급불가사유',
                fieldName: 'Remark',
                type: 'text',
                initialWidth: 150,
                cellAttributes: {alignment: 'left'},
                hideDefaultActions: true
            },
            {
                label: '수량',
                fieldName: 'NotShippedQuantity',
                type: 'number',
                initialWidth: 50,
                cellAttributes: {alignment: 'right'},
                hideDefaultActions: true
            },
            {
                label: '적치장소',
                fieldName: 'SourceLocation',
                type: 'text',
                initialWidth: 100,
                cellAttributes: {alignment: 'center'},
                hideDefaultActions: true
            },
            {
                label: '입고일시',
                fieldName: 'RSV_Date__c',
                type: 'text',
                initialWidth: 200,
                cellAttributes: {alignment: 'center'},
                hideDefaultActions: true
            },
            {
                label: '모델',
                fieldName: 'ModelName',
                type: 'text',
                initialWidth: 150,
                cellAttributes: {alignment: 'left'},
                hideDefaultActions: true
            },
            {
                label: '소비자가',
                fieldName: 'CustPrice',
                type: 'number',
                initialWidth: 80,
                cellAttributes: {alignment: 'right'},
                hideDefaultActions: true
            },
            {
                label: '특기사항',
                fieldName: '',
                type: 'number',
                initialWidth: 80,
                cellAttributes: {alignment: 'right'},
                hideDefaultActions: true
            },
            {
                label: '약속번호',
                fieldName: 'ResrvNumber',
                type: 'text',
                initialWidth: 100,
                cellAttributes: {alignment: 'center'},
                hideDefaultActions: true
            },
            {
                label: '항번',
                fieldName: '',
                type: 'text',
                initialWidth: 100,
                cellAttributes: {alignment: 'center'},
                hideDefaultActions: true
            },
            {
                label: '주문번호',
                fieldName: '',
                type: 'text',
                initialWidth: 100,
                cellAttributes: {alignment: 'center'},
                hideDefaultActions: true
            },
            {
                label: '항번',
                fieldName: '',
                type: 'text',
                initialWidth: 100,
                cellAttributes: {alignment: 'center'},
                hideDefaultActions: true
            },
            {
                label: '입력자',
                fieldName: 'CreatedByName',
                type: 'text',
                initialWidth: 56,
                cellAttributes: {alignment: 'center'},
                hideDefaultActions: true
            },
            {
                label: '센터코드',
                fieldName: 'CreatedBySVCCODE',
                type: 'text',
                initialWidth: 70,
                cellAttributes: {alignment: 'center'},
                hideDefaultActions: true
            },
            {
                label: '센터명',
                fieldName: 'LocationName',
                type: 'text',
                initialWidth: 120,
                cellAttributes: {alignment: 'left'},
                hideDefaultActions: true
            },

        ];
        component.set('v.columns', columns);
        console.log('columns',columns);
        let detailcolumns = [
            {
                label: '주문번호',
                fieldName: 'orderNumber',
                type: 'text',
                initialWidth: 100,
                cellAttributes: {alignment: 'center'},
                hideDefaultActions: true
            },
            {
                label: '항번',
                fieldName: '',
                type: 'text',
                initialWidth: 100,
                cellAttributes: {alignment: 'center'},
                hideDefaultActions: true
            },
            {
                label: '공급예정일',
                fieldName: 'SupplySchDate',
                type: 'date',
                initialWidth: 200,
                cellAttributes: {alignment: 'center'},
                hideDefaultActions: true
            },
            {
                label: '공급지연 사유',
                fieldName: 'Remark',
                type: 'text',
                initialWidth: 200,
                cellAttributes: {alignment: 'center'},
                hideDefaultActions: true
            },
            {
                label: '입력자',
                fieldName: '',
                type: 'date',
                initialWidth: 200,
                cellAttributes: {alignment: 'center'},
                hideDefaultActions: true
            },
            {
                label: '입력일자',
                fieldName: '',
                type: 'date',
                initialWidth: 200,
                cellAttributes: {alignment: 'center'},
                hideDefaultActions: true
            },
            {
                label: '수급담당자',
                fieldName: '',
                type: 'date',
                initialWidth: 200,
                cellAttributes: {alignment: 'center'},
                hideDefaultActions: true
            },
            // {
            //     label: '입고일자',
            //     fieldName: 'RSV_Date__c',
            //     type: 'text',
            //     initialWidth: 200,
            //     cellAttributes: {alignment: 'center'},
            //     hideDefaultActions: true
            // },
            // {
            //     label: '미출고사유',
            //     fieldName: 'UnProcessReason',
            //     type: 'text',
            //     initialWidth: 300,
            //     cellAttributes: {alignment: 'left'},
            //     hideDefaultActions: true
            // },
            // {
            //     label: '특기사항',
            //     fieldName: 'msgDetail',
            //     type: 'text',
            //     initialWidth: 400,
            //     cellAttributes: {alignment: 'left'},
            //     hideDefaultActions: true,
            //     editable: true
            // },
            // {
            //     label: '취소일시',
            //     fieldName: 'CancelDate',
            //     type: 'datetime',
            //     initialWidth: 200,
            //     cellAttributes: {alignment: 'center'},
            //     hideDefaultActions: true
            // },
            // {
            //     label: '취소입력자',
            //     fieldName: 'CancelUser',
            //     type: 'text',
            //     initialWidth: 150,
            //     cellAttributes: {alignment: 'center'},
            //     hideDefaultActions: true
            // }
        ];
        component.set('v.detailcolumns', detailcolumns);
        console.log('detailcolumns',detailcolumns);
    },
// 메시지 모달
    openMessageModal : function(component, event, helper){
        console.log('openMessageModal');
        var rowItem = component.get('v.selectedGrid');
        let validation = rowItem.every(item=>{
           if('PH8002,PH0300'.includes(item.CreatedBySVCCODE)) {
               helper.showToast('warning','소모품은 메시지를 보낼수 없습니다.');
               return false;
           } else {
               return true;
           }
        });
        if(!validation) {
            return;
        }
        console.log('rowItem == >',JSON.stringify(rowItem));
        var type = rowItem[0].OrderType;
        console.log('type ==>',type);

        var prId = rowItem[0].productRequestLineItemId;
        var WorkOrderId = rowItem[0].workOrderId;

        if(type == 'C'){
            $A.createComponent(
                "c:FS_ResrvMessagePop",
                {
                    "prId"          : prId,
                    "WorkOrderId"   : WorkOrderId,
                    "rowItem"       : rowItem
                },
                function(cCommonConfirm, status, errorMessage) {
                    if(status === "SUCCESS") {
                        // callback action
                        component.set("v.modalContent", cCommonConfirm);
                    } else if (status === "INCOMPLETE") {
                        console.log("No response from server or client is offline.");
                    } else if (status === "ERROR") {
                        console.log("Error: " + errorMessage);
                    }
                }
            );
        }else{
            helper.showToast('warning','일반고객 요청건만 메시지 발송이 가능합니다.')
        }
    },
    doGetInitData: function (component, event, helper) {
        console.log('doGetInitData');
        var action = component.get('c.doGetInitData');
        action.setCallback(this, function (response) {
            var state = response.getState();

            if (state === "SUCCESS") {

                var result = response.getReturnValue();
                var mapSettingValueOrigin = result['mapSettingValueOrigin'];
                mapSettingValueOrigin.Comm.divOrgCode= mapSettingValueOrigin.Comm.divOrgCode.reduce((acc, obj) => {
                    const label = obj.label;
                    if (acc.filter(item=>item.label===label).length===0) {
                        acc.push(obj);
                    }
                    return acc;
                }, []);

                // 원본 따로 저장.
                component.set('v.mapSettingValueOrigin', mapSettingValueOrigin);
                // 원본 값은 복사 후 화면에 뿌릴용도로 따로 저장.
                var mapSettingValue = mapSettingValueOrigin;
                component.set('v.mapSettingValue', mapSettingValue);

                var userDeptType  = component.get('v.userDeptType');
                if(userDeptType == 'E' || userDeptType == 'G' || userDeptType == 'H'){
                    if(component.get('v.userDeptCode') != undefined && component.get('v.userDeptCode') != null){
                        console.log('aaa');

                        window.setTimeout(
                            $A.getCallback( function() {
                                console.log('bbb');
                                component.find('deptSelect').set('v.value',component.get('v.userDeptCode'));

                            },3000));

                    }
                    if(component.get('v.userCenterCode') != undefined && component.get('v.userCenterCode') != null){
                        console.log('ccc');
                        window.setTimeout(
                            $A.getCallback( function() {
                                console.log('ddd');
                                component.find('centerSelect').set('v.value',component.get('v.userCenterCode'));


                            },3000));
                        console.log(component.find('centerSelect').get('v.value'));


                    }
                }
                // 조회조건 세팅(기본값)
                // this.doInitSearchParamSetting(component, event, helper);
            } else {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) this.showToast("error", errors[0].message);
                } else {
                    this.showToast("error", "Unknown error");
                }
            }

            // component.set('v.showSpinner', false);
        });
        $A.enqueueAction(action);
    },

    doGetMaterialMansgerInfo: function (component, event, helper) {
        console.log('doGetMaterialMansgerInfo');
        var action = component.get('c.doGetMangerInfo');
        // action.setParams({
        //     mapSearchParam : mapSearchParam,
        // });
        action.setCallback(this, function (response) {
            var state = response.getState();
            console.log('state',state);
            if (state === "SUCCESS") {

                var result = response.getReturnValue();
                var managerInfo  = result['mtManager'];
                console.log('managerInfo==>'+JSON.stringify(managerInfo));
                component.set('v.managerInfo',managerInfo);
                var isManager = false;
                if(managerInfo != null) isManager = true;
                console.log('isManager?',isManager);
                component.set('v.isManager',isManager);

                // var mapSettingValue = mapSettingValueOrigin;
                // component.set('v.mapSettingValue', mapSettingValue);

            } else {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) this.showToast("error", errors[0].message);
                } else {
                    this.showToast("error", "Unknown error");
                }
            }

            // component.set('v.showSpinner', false);
        });
        $A.enqueueAction(action);
    },

    // 조회버튼 클릭 시 lightning datatable
    doGetResrvData: function (component, event, helper) {
        console.log('doGetResrvData');
        // component.find('table_ResrvProcessing').changeListValue([]);
        component.set('v.showSpinner', true);
        // var action = component.get('c.doGetResrvDataList');
        var action = component.get('c.searchResrvData');
        var mapSearchParam = component.get('v.mapSearchParam');
        var userCenterId = component.get('v.userCenterId');
        var userCenterName = component.get('v.userCenterName');
        var mapSettingValue = component.get('v.mapSettingValue');
        var listMapCenter =mapSettingValue.Comm.listMapCenter;
        mapSearchParam.listMapCenter = listMapCenter.map(item=>item.value);
        // 날짜 조건 중 '기준일자TO'의 하루를 늘려 조회
        // Salesforce SOQL은 Date 비교시 부등호 기호 '<='가 적용이 안됨
        var baseDateEnd = mapSearchParam.baseDateEnd;
        console.log('mapSearchParam=1=>',baseDateEnd);

        var baseDateStart = mapSearchParam.baseDateStart;
        console.log('mapSearchParam=2=>',baseDateStart);

        if(baseDateEnd != null && baseDateStart != null){
            var endDate = new Date(baseDateEnd.substring(0, 4) * 1
                , (baseDateEnd.substring(5, 7) * 1) - 1
                , baseDateEnd.substring(8) * 1);
            var stDate = new Date(baseDateStart.substring(0, 4) * 1
                , (baseDateStart.substring(5, 7) * 1) - 1
                , baseDateStart.substring(8) * 1);
            stDate.setDate(stDate.getDate() - 1);
            endDate.setDate(endDate.getDate() + 1);
            mapSearchParam.endDate = this.changeDateFormat(endDate);
            mapSearchParam.startDate = this.changeDateFormat(stDate);
        }else{
            this.showToast("error", "기준일자를 선택해 주십시오.");
        }

        console.log('mapSearchParam :: ' + JSON.stringify(mapSearchParam));
        console.log('userCenterId :: ' + userCenterId);
        let condition='';
        let checkWorkOrder = component.find('checkWorkOrder');
        let checkCIC = component.find('checkCIC');
        if(mapSearchParam.type === 'SM'  && checkWorkOrder.get('v.checked')) {
            condition='workOrder';
        }
        if(mapSearchParam.type === 'Customer' && checkCIC.get('v.checked')){
            condition='CIC';
        }
        component.set('v.condition', condition);

        action.setParams({
            mapSearchParam : mapSearchParam,
            condition:condition
        });
        action.setCallback(this, function (response) {
            // var tableCmp = component.find("table_ResrvProcessing");
            // tableCmp.reset();

            var state = response.getState();
            let notProcessedList = [];
            let statusList = [];
            let ProcessedList = [];
            if (state === "SUCCESS") {
                let result = response.getReturnValue();
                console.log(result);
                let notPartCompleted = component.get('v.ifPartCompleted');
                let userPermission = component.get('v.userPermission');
                let userCode = component.get('v.userSMcode');
                let userCenterCode = component.get('v.userCenterCode');
                let userSMName = component.get('v.userSMName');

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                let productRequestLineItems = result.productRequestLineItems;
                let releaseProductTransfers = result.releaseProductTransfers;
                let receivedProductTransfers = result.receivedProductTransfers;
                // let directProductTransfers = result.directProductTransfers;
                let slOrderProgresses = result.slOrderProgresses;
                let returnOrderLineItems = result.returnOrderLineItems;
                let pickListMap = result.pickListMap;
                let productLocations = result.productLocation || {};
                let getDeptName = result.getDeptName;

                let listPRLI = productRequestLineItems
                    .map(productRequestLineItem => {
                        const releaseProductTransfer = releaseProductTransfers[productRequestLineItem.Id] || [];
                        const recentRelease = releaseProductTransfer[0] || {};
                        const releaseProduct = recentRelease.Product2 || {};

                        const receivedProductTransfer = receivedProductTransfers[productRequestLineItem.Id] || [];
                        const receivedGroupBy = receivedProductTransfer.reduce((acc, {ProductRequestLineItemId,QuantityReceived,SourceLocation,SourceLocationId,CreatedDate,CreatedBy,DestinationLocation,DestinationLocationId,Return_Order_Quantity__c,Product2Id}) => {
                            acc.ProductRequestLineItemId =(acc.CreatedDate > CreatedDate) ? acc.ProductRequestLineItemId : ProductRequestLineItemId;
                            acc.Ids.push(ProductRequestLineItemId);
                            acc.QuantityReceived += QuantityReceived;
                            acc.SourceLocations.push(SourceLocation);
                            acc.SourceLocation = (acc.CreatedDate > CreatedDate)  ? acc.SourceLocation : SourceLocation;
                            acc.SourceLocationId = (acc.CreatedDate > CreatedDate)  ? acc.SourceLocationId : SourceLocationId;
                            DestinationLocation.QuantityReceived = QuantityReceived;
                            DestinationLocation.Return_Order_Quantity__c =Return_Order_Quantity__c ;
                            DestinationLocation.Product2Id=Product2Id;
                            acc.DestinationLocations.push(DestinationLocation);
                            acc.DestinationLocation = (acc.CreatedDate > CreatedDate)  ? acc.DestinationLocation : DestinationLocation;
                            acc.DestinationLocationId = (acc.CreatedDate > CreatedDate)  ? acc.DestinationLocationId : DestinationLocationId;
                            acc.completeDate = (acc.CreatedDate > CreatedDate) ? acc.CreatedDate : CreatedDate;
                            acc.completeName = (acc.CreatedDate > CreatedDate) ? acc.CreatedBy.Name : CreatedBy.Name;
                            return acc;
                        },{ProductRequestLineItemId:'',Ids:[],SourceLocations:[],QuantityReceived:0,SourceLocation:{},SourceLocationId:'',CreatedDate:'',CreatedBy:{},DestinationLocations:[],DestinationLocationId:'',DestinationLocation:{} });

                        const receivedLocationGroupBy = helper._parse(Object.values(receivedProductTransfer.reduce((acc,element)=>{
                            const key = `${element.DestinationLocationId}^${element.Product2Id}`;
                            acc[key] = acc[key] || {Product2Id : element.Product2Id,QuantityReceived : 0,DestinationLocationId : element.DestinationLocationId , DestinationLocation : [],Return_Order_Quantity__c : 0};
                            acc[key].QuantityReceived += element.QuantityReceived;
                            acc[key].Return_Order_Quantity__c += element.Return_Order_Quantity__c;
                            acc[key].DestinationLocation.push(element.DestinationLocation);
                            return acc;
                        },{})));


                        const slOrderProgress = slOrderProgresses[productRequestLineItem.Id] || [];
                        const firstSlOrderProgress = slOrderProgress[0] || {};

                        const returnOrderLineItem = returnOrderLineItems[productRequestLineItem.Id] || [];
                        const firstReturnOrderLineItem = returnOrderLineItem[0] || {};

                        const cancelUser = productRequestLineItem.CANCEL_UserId__r || {};

                        const recordType = productRequestLineItem.RecordType || {};
                        const workOrder = productRequestLineItem.WorkOrder || {};

                        const parent = productRequestLineItem.Parent || {};
                        const parentOrderCustId =parent.Order_CUST_Id__r || {};
                        const parentDestination = parent.DestinationLocation || {};

                        const srResrvPart = productRequestLineItem.SR_RESRV_PART_Id__r || {};

                        const destinationLocation = productRequestLineItem.DestinationLocation || {};
                        const destinSmDept= destinationLocation.SM_DEPT_Id__r || {};
                        const destiHighSmDept = destinSmDept.HIGH_DEPT_CODE__r || {};
                        const serviceResource = destinationLocation.ServiceResource__r || {};

                        const sourceLocation = productRequestLineItem.SourceLocation || {};
                        const sourceParentLocation = sourceLocation.ParentLocationId__r || {};
                        const sourceRecordType = sourceLocation.RecordType || {};


                        const product = productRequestLineItem.Product2 || {};

                        const productLocationInfo = productLocations[product.DIV_CODE__c+product.ProductCode] || {};
                        const productLocation = productLocationInfo.Location || {};

                        const orderReqDeptTypeCode = parent.Order_Req_Dept_Type_Code__c;
                        const orderCustName = parent.Order_CUST_Name__c || '';

                        let contactNumber=orderReqDeptTypeCode ==='C' ? parentOrderCustId.Phone||parentOrderCustId.MobilePhone:
                            orderReqDeptTypeCode ==='E' ? serviceResource.fm_EmployeeNumber__c:
                                orderReqDeptTypeCode ==='A' ? orderCustName.split('/')[1] :'';

                        let formatCustName = orderReqDeptTypeCode ==='C' ? this.maskingStr(parent.fm_Order_CUST_Name__c):
                            orderReqDeptTypeCode ==='E' ? serviceResource.Name :
                                orderReqDeptTypeCode ==='A' ? orderCustName.split('/')[0] :'';

                        let unProcessMap = pickListMap.unProcessMap;
                        let processMap = pickListMap.processMap;
                        let lgeStatusMap = pickListMap.lgeStatusMap;
                        let ShippedDepartMent =sourceRecordType.DeveloperName ==='DIV' ? sourceLocation.Name : sourceParentLocation.Name ;
                        let LocationName = destinationLocation.DEPT_CODE__c ? getDeptName[destinationLocation.DEPT_CODE__c] : '';
                        let adJustQty = productRequestLineItem.Adjust_Quantity__c || 0;
                        let returnOrderQty = productRequestLineItem.Return_Order_Quantity__c || 0;
                        let receivedQuantity = ShippedDepartMent === LocationName ? productRequestLineItem.QuantityRequested : receivedGroupBy.QuantityReceived;
                        let receivedPartNo = ShippedDepartMent === LocationName ? product.ProductCode : releaseProduct.ProductCode;
                        let orgQuantity = adJustQty ;


                        let isRent = (receivedQuantity === 0 || receivedQuantity === null || receivedQuantity === orgQuantity || recordType.DeveloperName === 'RESV_SALE' ||
                            (userPermission === true && userCode !== parent.CreatedBy.EmployeeNumber__c && parent.Parts_INPUT_Type_Code__c !== 'B') ||
                            (userPermission === false && destinationLocation.DEPT_CODE__c !== userCenterCode && parent.Parts_INPUT_Type_Code__c !== 'B') ||
                            (workOrder.lgeStatus__c !=='0' && workOrder.lgeStatus__c !=='1' && workOrder.lgeStatus__c !=='2' && workOrder.lgeStatus__c !== 'A')) ? 'disabled' : false;
                        let isCancel = (destinationLocation.DEPT_CODE__c === 'PH0300' || destinationLocation.DEPT_CODE__c === 'PH8002' ||
                            (userPermission === true && userCode !== parent.CreatedBy.EmployeeNumber__c && parent.Parts_INPUT_Type_Code__c !== 'B') ||
                            (userPermission === false && destinationLocation.DEPT_CODE__c !== userCenterCode && parent.Parts_INPUT_Type_Code__c !== 'B')) ? 'disabled' : false;

                        let status = productRequestLineItem.Status === 'C' ? '약속취소' :
                            productRequestLineItem.Status === 'P' ? '할당중' :
                                recordType.DeveloperName === 'RESV_RENT' && sourceParentLocation.Id === destinationLocation.ParentLocationId__c && sourceLocation.ParentLocationId__c ? '입고완료' :
                                    recordType.DeveloperName === 'RESV_SALE' && sourceParentLocation.Id === productRequestLineItem.DestinationLocationId && sourceLocation.ParentLocationId__c ? '입고완료' :
                                        recordType.DeveloperName !== 'RENT' && (firstReturnOrderLineItem.Request_Adjust_Type_Code__c === 'C' || firstReturnOrderLineItem.Request_Adjust_Type_Code__c === 'S' || firstReturnOrderLineItem.Request_Adjust_Type_Code__c === 'D') ? '약속취소'  : //취소
                                            recordType.DeveloperName !== 'RENT' && productRequestLineItem.RENT_Adjust_Completion_YN__c ==='Y' ? '취소예약' :
                                                recordType.DeveloperName !== 'RENT' && productRequestLineItem.Request_Type_Code__c === 'R' ? '요청대기' :
                                                    recordType.DeveloperName !== 'RENT' && productRequestLineItem.Request_Type_Code__c === 'Q' ? '대치대기' :
                                                        Object.keys(recentRelease).length>0 && productRequestLineItem.QuantityRequested === receivedGroupBy.QuantityReceived ? '입고완료' :
                                                            Object.keys(recentRelease).length>0 && productRequestLineItem.QuantityRequested !== receivedGroupBy.QuantityReceived && receivedGroupBy.QuantityReceived > 0 ? '일부입고':
                                                                receivedGroupBy.QuantityReceived === 0 && orgQuantity > 0 ? '약속취소' :
                                                                    Object.keys(recentRelease).length>0 && receivedGroupBy.QuantityReceived === 0 ? '이동중' :
                                                                        Object.keys(recentRelease).length>0 && recordType.DeveloperName ==='RENT' && productRequestLineItem.Request_Type_Code__c === 'D' ? '미지정':
                                                                            '요청';

                        return {
                            CreatedDate : this.convertTo24HourFormat2(productRequestLineItem.CreatedDate)
                            ,recordtype :recordType.DeveloperName
                            ,RequesterCode : contactNumber
                            ,Requester : formatCustName
                            ,DivCode : product.DIV_CODE__c
                            ,requestPartNo : product.ProductCode
                            ,receivedPartNo : receivedPartNo
                            ,PartDesc : product.PART_DESC__c
                            ,ShippedDepartMent : ShippedDepartMent
                            ,ResrvStatus : ShippedDepartMent === LocationName ? '입고완료' : status
                            ,requestQuantity : productRequestLineItem.QuantityRequested
                            ,receivedQuantity: receivedQuantity
                            ,orgQuantity : orgQuantity
                            ,ReceiveNumber : workOrder.ReceiveNumber__c
                            ,custName : formatCustName
                            ,AppointMentDate : this.convertToDate(workOrder.SchedStartTime__c)
                            ,unprocessCode : workOrder.UNPROCESS_CODE__c
                            ,unProcessLabel : workOrder.UNPROCESS_CODE__c ? unProcessMap[workOrder.UNPROCESS_CODE__c] : ''
                            ,processCode : workOrder.Process_Code__c
                            ,processLabel : workOrder.Process_Code__c ? processMap[workOrder.Process_Code__c] : ''
                            ,CancelReason : productRequestLineItem.CANCEL_Reason__c
                            ,CancelUser : cancelUser.Name
                            ,CancelDate : productRequestLineItem.CANCEL_Date__c
                            ,AllocCancelYN : firstSlOrderProgress.ALLOC_CANCEL_YN__c || ''
                            ,Remark : firstSlOrderProgress.REMARK__c || ''
                            ,NotShippedQuantity : firstSlOrderProgress.fm_NOTSHIPPED_Quantity__c || 0
                            ,productLocationName : productLocation.Name
                            ,rsvDate : ShippedDepartMent === LocationName ? this.convertTo24HourFormat(productRequestLineItem.CreatedDate) :  this.convertTo24HourFormat(receivedGroupBy.completeDate)
                            ,ModelName : productRequestLineItem.MODEL_CODE__c
                            ,CustPrice : product.CUST_PRICE__c
                            ,prliRemark : productRequestLineItem.Remark__c
                            // ,ResrvNumber : parent.RSRV_Number__c    //저장에 필요
                            ,ResrvNumber : srResrvPart.RESRV_Number__c
                            ,rsrvSeq : productRequestLineItem.RSRV_SEQ__c
                            ,orderNumber : productRequestLineItem.Order_Number__c
                            ,orderSEQ : productRequestLineItem.Order_SEQ__c
                            ,orderSeq : productRequestLineItem.Order_SEQ__c
                            ,CreatedByName : parent.CreatedBy.Name
                            ,userEmplCode : parent.CreatedBy.EmployeeNumber__c
                            ,CreatedBySVCCODE : destinationLocation.DEPT_CODE__c
                            ,LocationName : LocationName
                            ,highDept : destiHighSmDept.Name
                            ,isCancel : isCancel
                            ,isRent : isRent
                            ,originCancel : isCancel
                            ,originRent : isRent
                            ,lgeStatus : workOrder.lgeStatus__c
                            ,lgeStatusLabel : lgeStatusMap[workOrder.lgeStatus__c]
                            ,OrderReqType : orderReqDeptTypeCode
                            ,partsInputTypeCode : parent.Parts_INPUT_Type_Code__c
                            ,SupplySchDate : recentRelease.DueDate__c ? recentRelease.DueDate__c : firstSlOrderProgress.SUPPLY_Scheduling_Date__c
                            ,userSMName : component.get('v.userSMName')
                            ,releaseProductTransfer : releaseProductTransfer
                            ,receivedGroupBy : receivedGroupBy
                            ,receivedProductTransfer :receivedProductTransfer
                            // ,directGroupBy : directGroupBy
                            ,adJustQty : adJustQty
                            ,returnOrderQty : returnOrderQty
                            ,cancelQuantity : productRequestLineItem.CANCEL_Quantity__c || 0
                            ,parentId : parent.Id
                            ,OrderType : parent.Order_Req_Dept_Type_Code__c
                            ,OrderChannel : parent.Order_CHNL_TYPE_Code__c
                            ,OrderChannelName : pickListMap.orderChannelMap[parent.Order_CHNL_TYPE_Code__c]
                            ,completeDate : this.convertTo24HourFormat(productRequestLineItem.Last_Update_Date__c)
                            ,completeName : status === '약속취소' ? cancelUser.Name : productRequestLineItem.LastModifiedBy.Name
                            // 저장로직

                            ,rsvSaveDate : ShippedDepartMent === LocationName ? this.convertToDate(productRequestLineItem.CreatedDate) :  this.convertToDate(receivedGroupBy.completeDate)
                            ,unitPrice : productRequestLineItem.UnitPrice__c || 0
                            ,productRequestLineItemId : productRequestLineItem.Id
                            ,sourceLocationId : productRequestLineItem.SourceLocationId
                            ,destinationLocationId : productRequestLineItem.DestinationLocationId
                            ,destinationLocationParentId : destinationLocation.ParentLocationId__c
                            ,destinationLocationSmId : destinationLocation.ServiceResource__c
                            ,destinationLocationSmNum : serviceResource.fm_EmployeeNumber__c
                            ,receivedDestinationLocations : receivedGroupBy.DestinationLocations.map(item=>item.Id)
                            ,receivedSourceLocations : receivedGroupBy.SourceLocations.map(item=>item.Id)
                            ,receivedLocationGroupBy : receivedLocationGroupBy
                            ,sourceLocationParentId : sourceLocation.ParentLocationId__c
                            ,product2Id : productRequestLineItem.Product2Id
                            ,myCenterYn : (sourceRecordType.DeveloperName ==='DIV' ? sourceLocation.Name : sourceParentLocation.Name) === (destinationLocation.DEPT_CODE__c ? getDeptName[destinationLocation.DEPT_CODE__c] : '') ? 'Y' : 'N'
                            ,releaseYn : releaseProductTransfer.length > 0 ? 'Y' : 'N'
                            ,moveTypeCode : productRequestLineItem.MOVE_Type_Code__c || 'null'
                            ,srResrvPartId : productRequestLineItem.SR_RESRV_PART_Id__c
                            ,workOrderId : workOrder.Id
                            ,contactName : workOrder.fm_CUST_Name__c

                        }
                    })
                    .filter(item=>{
                        if(notPartCompleted === true){
                            return item.ResrvStatus === '약속취소' || (item.orgQuantity === item.requestQuantity);
                        } else {
                            return item.ResrvStatus !== '약속취소' && (item.orgQuantity !== item.requestQuantity);
                        }
                    });
                let resrvStatus = component.get('v.mapSearchParam.resrvStatus');
                if (resrvStatus !== 'ALL') {
                    listPRLI=listPRLI.filter(item=>item.ResrvStatus === resrvStatus);
                }
                component.set('v.listPRLI', listPRLI);
                //////////////////////////////////////////////////////////////////////////////////////////
                let ifNotCompleted = component.get('v.ifNotCompleted');
                if(ifNotCompleted) {
                    this.handleSendMessage(component,'newUnComplete', {'type': 'getSearchList', listPRLI,'userPermission' : component.get('v.userPermission'),'userCode' : component.get('v.userSMcode'),'userCenterCode' : component.get('v.userCenterCode') ,'userSMName' : component.get('v.userSMName')});
                } else {
                    this.handleSendMessage(component,'complete', {'type': 'getSearchListComplete', listPRLI,'userPermission' : component.get('v.userPermission'),'userCode' : component.get('v.userSMcode'),'userCenterCode' : component.get('v.userCenterCode') ,'userSMName' : component.get('v.userSMName')});
                }
                component.set('v.listCnt',listPRLI.length);
            }else {
                var errors = response.getError();
                if (errors) {
                    // if (errors[0] && errors[0].message) this.showToast("error", "해당 조건의 약속건이 없습니다.");
                    component.set('v.listPRLI', []);
                } else {
                    this.showToast("error", "Unknown error");
                }
            }
            // 하위 LWC Function Call
            // component.find('table_ResrvProcessing').changeListValue(component.get('v.listPRLI'));
            // console.log('done!');
            component.set('v.showSpinner', false);
        });
        $A.enqueueAction(action);
    },
    //  예약영수증 팝업
    openResrvInfoPop : function(component, listPRId){
        console.log('openResrvInfoPop');

        var userCenterId = component.get('v.userCenterId');
        //var listPRId = event.getParam('listPRLIId');//todo listPRId
        //listPRId = '0TS0p0000004dBlGAI'; //sale '0TS0p0000004dBlGAI'; rent '0TS0p0000004dAOGAY'
        console.log('listPRId:::',listPRId);
        $A.createComponent(
            "c:FS_ScriptFormPop",
            {
                "sHeader": '예약증',
                "listRecordId": listPRId,
                "pdfType": 'FS_SalesReservationForm',
                "pdfType2": 'FS_SalesReservationForm' //FS_SalesReservationForm FS_RentInfoPdfForm
            },
            function (cCommonConfirm, status, errorMessage) {
                if (status === "SUCCESS") {
                    // callback action
                    component.set("v.modalContent", cCommonConfirm);
                } else if (status === "INCOMPLETE") {
                    console.log("No response from server or client is offline.");
                } else if (status === "ERROR") {
                    console.log("Error: " + errorMessage);
                }
            }
        );

    },
    // Toast Mesage
    showToast: function (type, message) {
        var evt = $A.get("e.force:showToast");
        evt.setParams({
            key: "info_alt",
            type: type,
            message: message
        });
        evt.fire();
    },

    // 날짜 포멧 변경하기 (YYYY.MM.DD)
    changeDateFormat: function (date) {
        var year = date.getFullYear();
        var month = ('0' + (date.getMonth() + 1)).slice(-2);
        var day = ('0' + date.getDate()).slice(-2);

        return year + '-' + month + '-' + day;
    },

    getResrvDetail: function(component, event, helper) {
        console.log('getResrvDetail');
        var action = component.get('c.getUserInfo');
    },
    getDivOrgCode : function(component,event,helper,divOrgCode) {
        let action = component.get('c.getDivCodeList');
        let whereField = ` AND DIV_ORG_CODE__c = '${divOrgCode}'`
        action.setParams({
            label : 'Name',
            value : 'DIV_CODE__c',
            joinField : 'DIV_CODE__c',
            joinKey : '_',
            whereField : divOrgCode ? whereField : ''
        });
        action.setCallback(this,function(response) {
            let state = response.getState();
            if(state ==='SUCCESS') {
                let result = response.getReturnValue();
                let orgDiv = result.reduce((acc, obj) => {
                    const value = obj.value;
                    acc += `'${value}',`;
                    return acc;
                }, '');
                component.set('v.mapSettingValue.Comm.divCode',result);
                component.set('v.mapSearchParam.divCode','');
                component.set('v.mapSearchParam.orgDiv',orgDiv.slice(0,-1));
            }
        });
        $A.enqueueAction(action);
    },
    //센터정보
    getCenterList: function(component, event, helper, deptCode) {
        console.log('getCenterList');
        var action = component.get('c.getCenterList');
        action.setParams({
            'deptCode' : deptCode
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var result = response.getReturnValue();
                var mapSettingValue = component.get('v.mapSettingValue');
                mapSettingValue.Comm.listMapCenter = result;
                component.set('v.mapSettingValue', mapSettingValue);
            } else {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) this.showToast("error", errors[0].message);
                } else {
                    this.showToast("error", "Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    },
    saveResrv : function(component,event,helper) {
        let cancelItems = this._parse(component.get('v.cancelItems'));
        let rentItems = this._parse(component.get('v.rentItems'));
        if(cancelItems.length > 0) {
            let validation=cancelItems.every(item=>{
                if(!item.CancelReason) {
                    this.showToast("error", "취소사유를 입력하세요.");
                    return false;
                }
                if (!item.CancelUser) {
                    this.showToast("error", "실통화자를 입력하세요.");
                    return false;
                }
                return true;
            });
            if(!validation) {
                return;
            }
        }
        if(rentItems.length === 0 && cancelItems.length === 0) {
            this.showToast("error", "저장할 데이터를 선택하세요");
            return ;
        }
        component.set('v.showSpinner', true);
        let action = component.get('c.saveResrv');
        action.setParams({
            cancelItems : cancelItems,
            rentItems : rentItems
        });
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                let result=response.getReturnValue();
                helper.showToast('success','수정 사항이 저장되었습니다.');
                helper.doGetResrvData(component, event, helper);
            } else{
                let errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) helper.showToast("error", "저장을 실패 했습니다. errorCode :"+errors[0].message);
                    component.set('v.listPRLI', []);
                } else {
                    helper.showToast("error", "Unknown error");
                }
            }
            component.set('v.showSpinner',false);
        });
        $A.enqueueAction(action);

    },
    // Salseforce -> Wijmo
    handleSendMessage: function (component,tabId, name){
        component.find(`jsApp_${tabId}`).message({
            name
        });
    },
    //약속관리 리스트
    openResrvListView: function(component,event,helper) {
        console.log('openResrvListView');
        var userCenterId = component.get('v.userCenterId');
        var mapSearchParam = component.get('v.mapSearchParam');
        var condition = component.get('v.condition');

        $A.createComponent(
            "c:FS_ResrvListViewPop",
            {
                "userCenterId"          : userCenterId
                ,"mapSearchParam"        : mapSearchParam
                ,"condition"        : condition
            },
            function(cCommonConfirm, status, errorMessage) {
                if(status === "SUCCESS") {
                    // callback action
                    component.set("v.modalContent", cCommonConfirm);
                } else if (status === "INCOMPLETE") {
                    //console.log("No response from server or client is offline.");
                } else if (status === "ERROR") {
                    //console.log("Error: " + errorMessage);
                }
            }
        );
    },
    _parse : function(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    maskingStr : function(inputString) {
        let resultString='';
        inputString = inputString || '';
        if(inputString.length > 2) {
            let stringLength = inputString.length;
            resultString = inputString.substring(0,1);
            for(let j = 0; j < stringLength - 2; j++) {
                resultString += '*';
            }
            resultString += inputString.substring(stringLength - 1,stringLength);
        } else {
            resultString = inputString;
        }
        return resultString;
    },
    convertTo24HourFormat : function(dateString) {
        if(dateString){
            const dateParts = dateString.split('. ');
            const timePart = dateParts[3].split(' ');

            let hour = parseInt(timePart[1].split(':')[0], 10);
            const minute = timePart[1].split(':')[1];

            if (timePart[0] === '오후' && hour !== 12) {
                hour += 12;
            } else if (timePart[0] === '오전' && hour === 12) {
                hour = 0;
            }
            return `${dateParts[0]}. ${dateParts[1]}. ${dateParts[2]}. ${hour.toString().padStart(2, '0')}:${minute}`;
        } else {
            return '';
        }
    },
    convertTo24HourFormat2 :function(dateString) {
        if(dateString){
            const dateParts = dateString.split('. ');
            const timePart = dateParts[3].split(' ');

            let hour = parseInt(timePart[1].split(':')[0], 10);
            const minute = timePart[1].split(':')[1];

            if (timePart[0] === '오후' && hour !== 12) {
                hour += 12;
            } else if (timePart[0] === '오전' && hour === 12) {
                hour = 0;
            }
            return `${dateParts[0]}. ${dateParts[1] < 10 ? '0'+dateParts[1] : dateParts[1]}. ${dateParts[2] < 10 ? '0'+dateParts[2] : dateParts[2]}. ${hour.toString().padStart(2, '0')}:${minute}`;
        } else {
            return '';
        }
    },
    convertToDate : function(dateString) {
        if(dateString){
            const dateParts = dateString.split('. ');
            return `${dateParts[0]}-${dateParts[1] < 10 ? '0'+dateParts[1] : dateParts[1]}-${dateParts[2] < 10 ? '0'+dateParts[2] : dateParts[2]}`;
        } else {
            return '';
        }
    }
})
