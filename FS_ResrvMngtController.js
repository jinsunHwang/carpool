({
    fnInit : function(component, event, helper) {
        helper.setTabId(component, event, helper);

        var today = new Date();
        var monthDigit = today.getMonth() + 1;
        if (monthDigit <= 9) {
            monthDigit = '0' + monthDigit;
        }
        var dayDigit = today.getDate();
        if(dayDigit <= 9){
            dayDigit = '0' + dayDigit;
        }

        var startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 3);
        startDate = helper.changeDateFormat(startDate);

        var resrvStatus = {
            'a': '전체',
            'b': '요청중',
            'c': '대기중'

        }
        component.set('v.mapSearchParam.baseDateStart', startDate);
        component.set('v.mapSearchParam.baseDateEnd', today.getFullYear() + "-" + (monthDigit) + "-" + dayDigit);

        component.find('btnUnProcessed').set('v.variant', 'brand');
        // component.find('btnTargetAll').set('v.variant', 'brand');
        component.set('v.mapSearchParam.complete','Not');
        // component.find('btnUnProcessed').set('v.variant', 'brand');

        component.set('v.mapSearchParam.type','All');

        // component.set('v.mapSearchParam.complete','Not');

        // 사용자 로그인 정보 세팅
        helper.getUserInfo(component, event, helper);
        // Datatable 세팅
        helper.doInitDatatableSetting(component, event, helper);
        // 조회조건 세팅(DB참조)
        helper.doGetInitData(component, event, helper);

    },

    fnInitialize : function(component, event, helper){
        console.log('fnInitialize');
        var today = new Date();
        var monthDigit = today.getMonth() + 1;
        if (monthDigit <= 9) {
            monthDigit = '0' + monthDigit;
        }
        var dayDigit = today.getDate();
        if(dayDigit <= 9){
            dayDigit = '0' + dayDigit;
        }
        var userCenter = component.get('v.userCenterName');
        var startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 3);
        startDate = helper.changeDateFormat(startDate);
        component.set('v.mapSearchParam.baseDateStart', startDate);
        component.set('v.mapSearchParam.baseDateEnd', today.getFullYear() + "-" + (monthDigit) + "-" + dayDigit);
        component.set('v.mapSearchParam.type', 'All');
        component.set('v.mapSearchParam.divOrgCode', '');
        component.set('v.mapSearchParam.divCode', '');
        component.set('v.mapSearchParam.divOrgCenter', '');
        component.set('v.ifAll',true);
        component.set('v.ifCustomer',false);
        component.set('v.ifCenter',false);
        component.set('v.ifSM',false);
        component.set("v.listPRLI",[]);
        component.find('table_ResrvProcessing').changeListValue([]);
        component.set("v.listDetail",[]);
        component.find('table_ResrvDetail').changeListValue([]);
        component.set("v.rowItem",[]);
        component.set('v.mapSearchParam.complete','Not');
        component.set('v.mapSearchParam.type','All');
        // helper.doGetInitData(component, event, helper);
        component.find("b_opt").set("v.value", component.get('v.userSMName'));
        helper.doInitSearchParamSetting(component, event, helper);
    },
    onClickUnprocessed : function(component, event, helper){
        component.set('v.mapSearchParam.complete','Not');
        component.set('v.ifNotCompleted',true);
        component.set('v.ifPartCompleted',false);
        if($A.util.hasClass(component.find('btnPartialProcessed'), 'active') === true){
            $A.util.removeClass(component.find('btnPartialProcessed'), 'active');
        }

        if($A.util.hasClass(component.find('btnUnProcessed'), 'active') === false){
            $A.util.addClass(component.find('btnUnProcessed'), 'active');
        }

        if($A.util.hasClass(component.find('btnProcessed'), 'active') === true){
            $A.util.removeClass(component.find('btnProcessed'), 'active');
        }

        component.set('v.listPRLI', []);
    },

    onClickPartialProcessed : function(component, event, helper){
        component.set('v.mapSearchParam.complete','Partial');
        component.set('v.ifNotCompleted',true);
        component.set('v.ifPartCompleted',true);

        if($A.util.hasClass(component.find('btnProcessed'), 'active') === true){
            $A.util.removeClass(component.find('btnProcessed'), 'active');
        }

        if($A.util.hasClass(component.find('btnUnProcessed'), 'active') === true){
            $A.util.removeClass(component.find('btnUnProcessed'), 'active');
        }

        if($A.util.hasClass(component.find('btnPartialProcessed'), 'active') === false){
            $A.util.addClass(component.find('btnPartialProcessed'), 'active');
        }

        component.set('v.listPRLI', []);
        component.find('table_ResrvProcessing').changeListValue(component.get('v.listPRLI'));

    },

    onClickProcessed : function(component, event, helper){
        component.set('v.mapSearchParam.complete','Processed');
        component.set('v.ifNotCompleted',false);
        component.set('v.ifPartCompleted',true);
        if($A.util.hasClass(component.find('btnProcessed'), 'active') === false){
            $A.util.addClass(component.find('btnProcessed'), 'active');
        }

        if($A.util.hasClass(component.find('btnUnProcessed'), 'active') === true){
            $A.util.removeClass(component.find('btnUnProcessed'), 'active');
        }

        if($A.util.hasClass(component.find('btnPartialProcessed'), 'active') === true){
            $A.util.removeClass(component.find('btnPartialProcessed'), 'active');
        }

        component.set('v.listPRLI', []);
    },
    // 깔떄기 모양 버튼 클릭 시
    fnShowFilter : function(component, event, helper){
        component.set("v.isShowedFilter", !component.get("v.isShowedFilter"));

    },
    handleChange : function(component ,event, helper){
        console.log('centerChanged');
        var action = component.get('c.getSMlist');
        var mapSearchParam = component.get('v.mapSearchParam');
        if(mapSearchParam.centerCode != ''){
            action.setParams({
                mapSearchParam : mapSearchParam,
            });
            action.setCallback(this, function (response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var result = response.getReturnValue();
                    component.set('v.SMList',result['mapSettingValueOrigin']);
                    var smmlist = component.get('v.SMList')
                    console.log('ddddd',smmlist.Comm.smCode);
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
        }
        // helper.doInitSearchParamSetting(component, event, helper);
    },

    // 조회 버튼 클릭 시
    fnSearch : function(component, event, helper){
        console.log('fnSearch');

        var mapSearchParam = component.get('v.mapSearchParam');
        // 기준일자 Validation (조회기간 6개월까지)
        if(mapSearchParam.releaseTarget == '출고완료'){

            var baseDateStart = mapSearchParam.baseDateStart;
            var baseDateEnd = mapSearchParam.baseDateEnd;

            var startDate = new Date(baseDateStart.substring(0, 4) * 1
                , (baseDateStart.substring(5, 7) * 1) - 1
                , baseDateStart.substring(8) * 1);

            var endDate = new Date(baseDateEnd.substring(0, 4) * 1
                , (baseDateEnd.substring(5, 7) * 1) - 1
                , baseDateEnd.substring(8) * 1);

            startDate.setMonth(startDate.getMonth() + 6);
            startDate.setDate(startDate.getDate() - 1);
            if(startDate < endDate){
                return helper.showToast('warning', '조회기간은 최대 6개월까지 가능합니다.');
            }

        }

        component.set("v.listDetail",[]);
        component.find('table_ResrvDetail').changeListValue([]);

        helper.doGetResrvData(component, event, helper);
    },

    // getResrvProcessingDatatable : function(component, event, helper){
    //     console.log('getResrvProcessingDatatable');

    //     var listData = event.getParam('rowItem');
    //     component.set('v.listDetail',listData);
    //     console.log(JSON.stringify(listData));

    //     var listDetail = component.get('v.listDetail');
    //     var listIds = [];

    //     listDetail.forEach(item => {
    //         listIds.push(item.Id);
    //     });

    //     listData.forEach(item => {
    //         // if(!listIds.includes(item.Id) &&
    //         if(item.SourceLocation != null || item.SupplySchDate != null || item.RSV_Date__c != null || item.msgDetail != null || item.CancelDate != null || item.UnProcessReason != null || item.CancelUser != null){
    //             listDetail.push(item);
    //         }
    //     });

    //     component.set('v.listDetail', listDetail);

    //     // component.find('table_ResrvDetail').changeListValue(component.get('v.listDetail'));
    // },

    resrvDetail : function(component, event, helper){
        console.log('resrvDetail Start');
        var rowItem = event.getParam('rowItem');
        component.set('v.rowItem',rowItem);

        component.set('v.listDetail', rowItem);
        component.find('table_ResrvDetail').changeListValue(rowItem);
        console.log('done!');

        helper.getResrvDetail(component,event,helper);
    },
    rowaction : function(component, event, helper){
        console.log('rowaction Start');
        // var rowItem = event.getParam('rowItem');
        // var listRowItem = component.get('v.listDetail');
        // var i = 0;
        // listRowItem = [];
        // listRowItem.push(rowItem);
        // console.log('listRoItem',listRowItem);

        // console.log('rowItem==>',JSON.stringify(rowItem));
        // component.set('v.rowItem',rowItem);

        // // var rowItem = component.get('v.rowItem');
        // // var listIds = [];

        // // rowItem.forEach(item => {
        // //     listIds.push(item.Id);
        // // });

        // // listData.forEach(item => {
        // //     if(!listIds.includes(item.Id)){
        // //         rowItem.push(item);
        // //     }
        // // });

        // component.set('v.listDetail', listRowItem);
        // console.log('v.listDetail',component.get('v.listDetail'));

        // component.find('table_ResrvDetail').changeListValue(rowItem);
        // console.log('done!');
        // helper.getResrvDetail(component,event,helper);
    },
    buttonchange : function (component, event, helper){
        console.log("buttonchange");

        var rowItem = event.getParam('detail');
        var listRowItem = component.get('v.listPRLI');
        var listDetail = component.get('v.listDetail');

        listDetail.push(rowItem);
        console.log('listRoItem',listDetail);

        console.log('rowItem==>',JSON.stringify(rowItem));
        component.set('v.rowItem',rowItem);

        var newDetail = [];

        listRowItem.forEach(item => {
            if(item.prId == rowItem.prId){
                // if(item.SourceLocation !== undefined || item.SupplySchDate !== undefined || item.RSV_Date__c !== undefined || item.msgDetail !== undefined || item.CancelDate !== undefined || item.UnProcessReason !== undefined || item.CancelUser !== undefined){
                newDetail.push(item);
                // }else{
                //     helper.showToast("error", "추가 상세 정보가 없습니다.")
                // }
            }
        });


        component.set('v.listDetail', listDetail);
        console.log('v.listDetail',component.get('v.listDetail'));
        component.find('table_ResrvDetail').changeListValue(newDetail);
        console.log('done!');

        // helper.getResrvDetail(component,event,helper);
        // var action = component.get('c.getResrvDetail');
        // action.setParams({
        //     'listIds'  : listIds
        // });
        // action.setCallback(this, function (response) {
        //     var state = response.getState();
        //     console.log('state == > ', state);

        //     if (state === "SUCCESS") {
        //         var result = response.getReturnValue();
        //         console.log(JSON.stringify(result));
        //         component.set('v.listDetail', result['listDetail']);
        //     } else {
        //         var errors = response.getError();
        //         if (errors) {
        //             if (errors[0] && errors[0].message) this.showToast("error", errors[0].message);
        //         } else {
        //             this.showToast("error", "Unknown error");
        //         }
        //     }
        // });
        // $A.enqueueAction(action);

    },
    fnMessageModalOpen : function(component, event, helper){
        console.log('fnMessageModalOpen start');

        // component.find('table_ResrvProcessing').fnMessageModalOpen();
        helper.openMessageModal(component,event,helper);
    },

    fnDetailSave : function(component, event, helper){
        console.log('fnDetailSave start');

        component.find('table_ResrvDetail').fnDetailSave();
    },

    fnBulkSave : function(component, event, helper){
        console.log('fnBulkSave');

        helper.saveResrv(component,event,helper);
    },
    detailSave : function(component, event, helper){
        console.log('detailSave');
        component.set('v.showSpinner', true);
        var i = 0;
        var rowItem = event.getParam('selectedItem');
        // console.log('selected size'+ rowItem.size());
        // for(var i = 0; i < rowItem.size(); i++){
        var prId = rowItem[i].prId;
        var note = rowItem[i].msgDetail;
        // }
        console.log('note',note);
        console.log('rowItem == >',JSON.stringify(rowItem));
        var action = component.get('c.detailUpdate');
        action.setParams({
            note   : note,
            prId   : prId
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            console.log('state ==> ',state);

            if (state === "SUCCESS") {
                var result = response.getReturnValue();
                helper.showToast("success", "수정 사항이 저장되었습니다.");
                // var a = component.get('c.fnInit');
                // $A.enqueueAction(a);
                component.set('v.showSpinner', false);

                console.log(result);

            }else {
                var errors = response.getError();
                component.set('v.showSpinner', false);
                if (errors) {
                    if (errors[0] && errors[0].message) helper.showToast("error", "저장을 실패 했습니다.");
                    component.set('v.listPRLI', []);
                } else {
                    helper.showToast("error", "Unknown error");
                }
            }
        });
        $A.enqueueAction(action);

    },
    onPRLIChange : function(component, event, helper){
        console.log("onlistDetailChange");

        var listDetail = event.getParam('data');

        console.log('listDetail :: ' + JSON.stringify(listDetail));
        component.set('v.listDetail', listDetail);
    },
    updateDraftValues: function(component, event, helper){
        console.log('updateDraftValues');
    },
    handleTypeChange: function(component, event, helper){
        console.log('typeChange');
        var typeValue = event.getParam('value');
        if(typeValue == ''){
            console.log('onClickAll');
            component.set('v.ifAll',true);
            component.set('v.ifCustomer',false);
            component.set('v.ifCenter',false);
            component.set('v.ifSM',false);
            component.set('v.mapSearchParam.type','All');
        }
        if(typeValue == 'Customer'){
            console.log('onClickCustomerr');
            component.set('v.ifCustomer',true);
            component.set('v.ifAll',false);
            component.set('v.ifCenter',false);
            component.set('v.ifSM',false);
            component.set('v.mapSearchParam.type','Customer');
        }
        if(typeValue == 'Center'){
            console.log('onClickCenter');
            component.set('v.ifCenter',true);
            component.set('v.ifAll',false);
            component.set('v.ifCustomer',false);
            component.set('v.ifSM',false);
            component.set('v.mapSearchParam.type','Center');
        }
        if(typeValue == 'SM'){
            console.log('onClickSM');
            component.set('v.ifSM',true);
            component.set('v.ifAll',false);
            component.set('v.ifCustomer',false);
            component.set('v.ifCenter',false);
            component.set('v.mapSearchParam.type','SM');
        }
    },
    fnResrvInfoModalOpen : function(component, event, helper){
        console.log('fnResrvInfoModalOpen');
        helper.handleSendMessage(component,'newUnComplete', {'type': 'fnResrvInfoModalOpen'});
        //component.find('table_ResrvProcessing').fnResrvInfoModalOpen();
    },

    //  예약영수증 팝업
    // openResrvInfoPop : function(component, event, helper){
    //     console.log('openResrvInfoPop');

    //     var userCenterId = component.get('v.userCenterId');
    //     var listPRId = event.getParam('listPRLIId');//todo listPRId
    //     //listPRId = '0TS0p0000004dBlGAI'; //sale '0TS0p0000004dBlGAI'; rent '0TS0p0000004dAOGAY'
    //     console.log('listPRLIId',listPRId);
    //     $A.createComponent(
    //         "c:FS_ScriptFormPop",
    //         {
    //             "sHeader": 'SM출고증',
    //             "listRecordId": listPRId,
    //             "pdfType": 'FS_SalesReservationForm' //FS_SalesReservationForm FS_RentInfoPdfForm
    //         },
    //         function (cCommonConfirm, status, errorMessage) {
    //             if (status === "SUCCESS") {
    //                 // callback action
    //                 component.set("v.modalContent", cCommonConfirm);
    //             } else if (status === "INCOMPLETE") {
    //                 console.log("No response from server or client is offline.");
    //             } else if (status === "ERROR") {
    //                 console.log("Error: " + errorMessage);
    //             }
    //         }
    //     );

    // },
    fnOpenSupplyPop: function(component, event, helper){
        console.log('fnOpenSupplyPop');

        component.find('table_ResrvDetail').fnOpenSupplyPop();
    },
    //공급예정일 팝업
    openSupplyPop : function(component, event, helper){
        console.log('openSupplyPop');

        var rowItem = event.getParam('selectedItem');
        console.log('rowItem == >',JSON.stringify(rowItem));

        $A.createComponent(
            "c:FS_CheckSupplyDatePop",
            {
                "CENTER"       : rowItem[0].LocationName,
                "partNo"       : rowItem[0].requestPartNo,
                'prId'         : rowItem[0].prId,
                'pCenterId'    : component.get('v.userCenterId'),
                "DIVCODE"      : rowItem[0].DivCode,
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
    },
    // Wijmo Grid 이벤트 관련 Method

    // Wijmo -> Salesforce
    handleMessage : function(component, message, helper){
        const payload = message.getParam('payload');
        console.log('Searchparts handleMessage data : ', JSON.parse(JSON.stringify(payload)));

        switch (payload.type) {
            case 'cellClick' :
                const cellItem = payload.item;
                component.set('v.listDetail',cellItem);
                component.find('table_ResrvDetail').changeListValue([JSON.parse(JSON.stringify(cellItem))]);
                break;
            case 'selectedGrid' :
                const selectedGrid = payload.selectedList;
                component.set('v.selectedGrid',selectedGrid);
                break;
            case 'selectedGridComplete' :
                const selectedGridComplete = payload.selectedList;
                break;
            case 'checkedCellisRent' :
                const checkedListRent = payload.checkedList;
                component.set('v.rowItem',checkedListRent);
                component.set('v.rentItems',checkedListRent);
                break;
            case 'checkedCellisCancel' :
                const checkedListCancel = payload.checkedList;
                checkedListCancel.every(item=>{
                    if('PH8002,PH0300'.includes(item.CreatedBySVCCODE)) {
                        helper.showToast('warning','소모품예약 취소는 문제가 될수 있습니다.');
                        return false;
                    } else {
                        return true;
                    }
                });

                component.set('v.rowItem',checkedListCancel);
                component.set('v.cancelItems',checkedListCancel);
                break;
            case 'dblclick' :

                var {item: item} = payload;

                console.log('SF item  : ', JSON.stringify(item));

                item.checkDiscount = false;
                item.ASCPrice = item.Price * item.itemCount;
                item.CHECKED = true;

                var partNo = item.ProductCode;
                var rowId = item.Id;
                var location = item.LocationId;
                var ModelName = item.MODELName;
                var pIsWon = item.CHECKED;

                var evt = $A.get("e.c:FS_WholeInventoryPop_evt");
                evt.setParam("pIsWon",pIsWon);
                evt.setParam("rowItem", item);
                evt.setParam("pModelName",ModelName);
                evt.setParam("rowId", rowId);
                evt.setParam("partNo", partNo);
                evt.setParam("productId",item.Product2Id);
                evt.setParam("locationId",location);

                evt.fire();

                component.destroy();

                break;
            case 'onclick':
                var {item: item} = payload;

                console.log('SF item  : ', JSON.stringify(item));

                component.set('v.rowItemInfo', item);

                break;
            case 'showRentInfo':
                var {item: item} = payload;
                console.log('SF get 차용 Item :: ' + JSON.stringify(item));
                console.log('getResrvInfo start');

                var rowInfo = item;

                component.set("v.pPartNo",rowInfo.ProductCode);
                component.set("v.partId",rowInfo.Product2Id);
                component.set("v.centerId",rowInfo.ParentLocationId);
                component.set("v.rowItemInfo", rowInfo);
                component.set("v.pLocationId", rowInfo.LocationId);
                component.set("v.modalOpen", false);
                component.set("v.rentModalOpen", true);

                helper.getRentInfo(component, event, helper, item);
                break;

            case 'showResrvInfo':
                var {item: item} = payload;
                console.log('SF get 약속 Item :: ' + JSON.stringify(item));
                console.log('showResrvInfo start');

                var rowInfo = item;

                component.set("v.pPartNo",rowInfo.ProductCode);
                component.set("v.partId",rowInfo.Product2Id);
                component.set("v.centerId",rowInfo.ParentLocationId);
                component.set("v.rowItemInfo", rowInfo);
                component.set("v.pLocationId", rowInfo.LocationId);
                component.set("v.modalOpen", false);
                component.set("v.rentModalOpen", false);
                component.set("v.resrvModalOpen", true);

                helper.getResrvInfo(component, event, helper, item);

                break;
            case 'fnResrvInfoModalOpen':
                var listParentId = payload.selectedList;
                helper.openResrvInfoPop(component, listParentId);
                break;
        }
    },

    //부서변경
    onChangeDept: function(component, event, helper) {
        var deptCode = component.find('deptSelect').get('v.value');
        var mapSearchParam = component.get('v.mapSearchParam');
        mapSearchParam.centerCode='';
        helper.getCenterList(component, event, helper, deptCode);
    },
    onDivOrgCode : function(component,event,helper) {
        var divOrgCode = component.find('divOrgCodeSelect').get('v.value');
        helper.getDivOrgCode(component, event, helper, divOrgCode);
    },
    handleInputChange : function(component,event,helper){
        console.log('handleInputChange');
        var telNumber = event.getParam("value");

        var formattedTelNumber = telNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');

        console.log('formattedTelNumber',formattedTelNumber);

        component.set('v.mapSearchParam.tellNo',formattedTelNumber);
    },
    fnExcelForm: function(component,event,helper) {
        let ifNotCompleted = component.get('v.ifNotCompleted');
        if(ifNotCompleted) {
            helper.handleSendMessage(component, 'newUnComplete', {'type' : 'downloadExcel'});
        } else {
            helper.handleSendMessage(component, 'complete', {'type' : 'downloadExcel'});
        }
    },
    fnResrvListViewForm : function(component,event,helper) {
        if(component.get('v.listPRLI').length<= 0){
            return;
        }
        helper.openResrvListView(component, event, helper);
    },
    handleSectionToggle : function(component,event,helper) {

    }
})
