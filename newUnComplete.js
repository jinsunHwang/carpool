const newUnCompleteGrid = {
    data : [],
    grid : {},
    cancelReason : [],
    headerCheck: {isRent:false,isCancel:false},
    init : async function() {
        console.log('new uncomplete init');
        LCC.addMessageHandler(message=>this.messageHandler(message));
        await this.initLookup();
        await this.initGrid();
        await this.initSelector();
        await this.initEvent();
    },
    initLookup : async function() {
        const wijmoParam = {listClassCode : ['PR008']};
        const result = await this.searchPick(wijmoParam,'getSMCodePicklist');
        this.cancelReason = [...result['PR008']];
    },
    searchPick : function (wijmoParam, methodName) {
        return new Promise((resolve, reject) => {
            Visualforce.remoting.Manager.invokeAction(
                `Wijmo_RequestPartsController.` + methodName,
                wijmoParam,
                (result, event) => {
                    resolve(result);
                    console.log('getSMCodePicklist result: ', result);

                    //console.log('getSMCodePicklist result : ', result);
                    try {
                    } catch(e) {
                        console.log('getSMCodePicklist e : ', e);
                    }
                },
                {escape: false},
                {buffer: false}
            );
        });
    },
    itemFormatter : function(panel,r,c,cell) {
        if(c === 12) {
            let value = panel.getCellData(r,c,true);
            if(value !== 'SM출고'){
                cell.innerHTML = `<input type="checkbox" class="isRent" name="isRent-${r}" >`;
                const checkbox = cell.querySelector("input[type='checkbox'],.isRent");
                if(value === "disabled") {
                    checkbox.checked = false;
                    checkbox.disabled = true;
                } else {
                    checkbox.checked = JSON.parse(value);
                    if(panel.rows[r].dataItem.originRent === 'disabled') {
                        checkbox.disabled = true;
                    }
                }
            }
        } else if (c === 17) {
            let value = panel.getCellData(r,c,true);
            if(value !== '취소') {
                cell.innerHTML = `<input type="checkbox" class="isCancel" name="isCancel-${r}">`;
                const checkbox = cell.querySelector("input[type='checkbox'],.isCancel");
                if(value === "disabled") {
                    checkbox.checked = false;
                    checkbox.disabled = true;
                } else {
                    checkbox.checked = JSON.parse(value);
                    if(panel.rows[r].dataItem.originCancel === 'disabled') {
                        checkbox.disabled = true;
                    }
                }
            }
        }
    },
    initGrid : function() {
        const grid = new wijmo.grid.FlexGrid("#theGrid",{
            allowSorting: true,
            showSort: true,
            stickyHeaders: true,
            showMarquee: true,
            autoGenerateColumns: false,
            itemFormatter : this.itemFormatter,
            columns : [
                { binding: 'CreatedDate', header: '입력일시', width: 140, align: 'center', isReadOnly: true},
                { binding: 'RequesterCode', header: '예약자코드', width: 90, align: 'center', isReadOnly: true},
                { binding: 'Requester', header: '예약자', width: 90, align: 'center', isReadOnly: true},
                { binding: 'DivCode', header: '사업부', width: 60, align: 'center', isReadOnly: true},
                { binding: 'requestPartNo', header: '요청PARTNO', width: 107, align: 'center',isReadOnly: true},
                { binding: 'receivedPartNo', header: '입고PARTNO', width: 107, align: 'center', isReadOnly: true},
                { binding: 'PartDesc', header: '품명', width: 120, align: 'center', isReadOnly: true},
                { binding: 'ShippedDepartMent', header: '출고부서', width: 120, align: 'center', isReadOnly: true},
                { binding: 'ResrvStatus', header: '예약상태', width: 80, align: 'center', isReadOnly: true},
                { binding: 'requestQuantity', header: '요청', width: 50, align: 'center', isReadOnly: true},
                { binding: 'receivedQuantity', header: '입고', width: 50, align: 'center', isReadOnly: true},
                { binding: 'orgQuantity', header: '정리', width: 50, align: 'center', isReadOnly: true},
                { binding: 'isRent', header: 'SM출고', width: 70, align: 'center', isReadOnly: true, allowSorting :false},
                { binding: 'ReceiveFormat', header: '접수번호', width: 150, align: 'center', isReadOnly: true},
                { binding: 'AppointMentDate', header: '예약일자', width: 150, align: 'center', isReadOnly: true},
                { binding: 'unprocessCode', header: '미처리코드', width: 150, align: 'center', isReadOnly: true},
                { binding: 'lgeStatusLabel', header: '미처리상태', width: 150, align: 'center', isReadOnly: true},
                { binding: 'isCancel', header: '취소', width: 70, align: 'center', isReadOnly: true, allowSorting :false},
                { binding: 'CancelReason', header: '취소사유', width: 150, align: 'center',editor: new wijmo.input.ComboBox(document.createElement('div'), {displayMemberPath: 'name', itemsSource :  this.cancelReason})},
                { binding: 'CancelUser', header: '실통화자', width: 70, align: 'center'},
                { binding: 'AllocCancelYN', header: 'PO취소', width: 80, align: 'center', isReadOnly: true},
                { binding: 'Remark', header: '공급불가사유', width: 150, align: 'center', isReadOnly: true},
                { binding: 'NotShippedQuantity', header: '수량', width: 50, align: 'center', isReadOnly: true},
                { binding: 'productLocationName', header: '적치장소', width: 120, align: 'center', isReadOnly: true},
                { binding: 'rsvDate', header: '입고일시', width: 120, align: 'center', isReadOnly: true},
                { binding: 'ModelName', header: '모델', width: 120, align: 'center', isReadOnly: true},
                { binding: 'CustPrice', header: '소비자가', width: 120, align: 'center', isReadOnly: true},
                { binding: 'prliRemark', header: '특기사항', width: 120, align: 'center', isReadOnly: true},
                { binding: 'ResrvNumber', header: '예약번호', width: 120, align: 'center', isReadOnly: true},
                { binding: 'rsrvSeq', header: '항번', width: 50, align: 'center', isReadOnly: true}, /*약속 채번*/
                { binding: 'orderNumber', header: '주문번호', width: 120, align: 'center', isReadOnly: true},
                { binding: 'orderSeq', header: '항번', width: 50, align: 'center', isReadOnly: true}, /*주문 채번*/
                { binding: 'inputUserInfo', header: '입력자', width: 70, align: 'center', isReadOnly: true},
                { binding: 'OrderChannelName', header: '주문채널', width: 120, align: 'center', isReadOnly: true},
                { binding: 'CreatedBySVCCODE', header: '센터코드', width: 150, align: 'center', isReadOnly: true},
                { binding: 'LocationName', header: '센터명', width: 150, align: 'center', isReadOnly: true},
            ],
            itemsSource : [...this.data],
            cellEditEnded : this.cellEditEnded,
        });
        this.grid = grid;

    },
    cellEditEnded : (s,e) => {
        const selectedRow = e.row;
        const selectedCol = e.col;
        const selectedHeader = e.getColumn().header;
        if(e.getRow().isSelected) {
            const selectedList= s.selectedRows.map(item=>{
                return item.dataItem;
            }).filter(item=>item);
            LCC.sendMessage({'type': 'cellEditGrid'}, selectedList);
        }
        let checkListRent = s.rows.filter(item=>item.dataItem.isRent === true).map(item=>item.dataItem);
        if(checkListRent.length>0){
            LCC.sendMessage({'type': 'checkedCellisRent', 'checkedList': checkListRent ? checkListRent : []});
        }

        let checkListCancel = s.rows.filter(item=>item.dataItem.isCancel === true).map(item=>item.dataItem);
        if(checkListCancel.length>0) {
            LCC.sendMessage({'type': 'checkedCellisCancel', 'checkedList': checkListCancel ? checkListCancel : []});
        }

    },
    initSelector : function() {
        const selector = new wijmo.grid.selector.Selector(this.grid,{
            itemChecked:(s,e)=>{
                const selectedList =this.grid.selectedRows.map(item=>{
                    const eachItemData = item.dataItem;
                    const isSelectorChecked = item.isSelected;
                    if(isSelectorChecked){
                        return eachItemData;
                    }
                }).filter(item=>item);
                LCC.sendMessage({'type':'selectedGrid',selectedList});
            }
        });
        this.grid.headersVisibility = wijmo.grid.HeadersVisibility.All;
        selector.column = this.grid.rowHeaders.columns[0];
    },
    initEvent : function() {
        const tip = new wijmo.Tooltip();
        const self = this;
        const grid = this.grid;
        // Tooltip Show Event
        grid.hostElement.addEventListener('mousemove', function (e) {
            self.showTooltip(tip,self,grid,e);
        });
        // Tooltip Hide Event
        grid.hostElement.addEventListener('mouseout', function (e) {
            tip.hide();
        });
        // Cell Click Event
        grid.hostElement.addEventListener('click', function(e) {
            self.cellClickEvent(grid,e,self);
        });

        grid.hostElement.addEventListener('change', function(e){
            self.cellCheckEvent(grid,e,self);
        });
    },
    showTooltip : function(tip,self,grid,e) {
        const ht = grid.hitTest(e.pageX, e.pageY);
        if (ht.cellType === wijmo.grid.CellType.Cell && (ht.col !== 2 && ht.col !== 9)) {
            const rng = ht.range;
            const cellElement = document.elementFromPoint(e.clientX, e.clientY),
                cellBounds = grid.getCellBoundingRect(ht.row, ht.col),
                data = wijmo.escapeHtml(grid.getCellData(rng.row, rng.col, true));
            if (cellElement.className.indexOf('wj-cell') > -1) {
                tip.show(grid.hostElement, data, cellBounds);
            } else {
                tip.hide();
            }
        }
    },
    cellClickEvent : function(grid,e,self) {
        const ht = grid.hitTest(e.pageX, e.pageY);
        const col = ht.col;
        const row = ht.row;
        if(col !== 18 && col !== 27 && col !== 12 && col !== 17 && col !== 19){
            let item = [];
            if (ht.panel === grid.cells) {
                item = ht.panel.rows[row].dataItem;
                LCC.sendMessage({'type':'cellClick', item});
            }
        } else if (col === 12 || col === 17) {
            if (ht.panel !== grid.cells) {
                if(col===12) self.headerCell(grid,e,'isRent');
                if(col===17) self.headerCell(grid,e,'isCancel');
            }
        } else if (col === 18 || col === 19) {
            grid.columns[col].isReadOnly=!grid.rows[row].dataItem.isCancel;
        }
    },
    cellCheckEvent : function(grid,e,self) {
        console.log('cell check');
        e.preventDefault();
        if (e.target.className === 'isRent') {
            self.checkCell(grid,e,self,'isRent');
        } else if (e.target.className === 'isCancel') {
            self.checkCell(grid,e,self,'isCancel');
        }
    },
    headerCell : function(grid,e,clsNm) {
        let disableCell = clsNm ==='isRent' ? 'isCancel' : 'isRent';
        let changeDataItem = grid.rows.map(item=>item.dataItem).filter(item=>item[clsNm] !== 'disabled');
        let checkValue = changeDataItem[0][clsNm];
        changeDataItem.map(item=>{
            let originData = (disableCell ==='isRent' ) ?  item.originRent :  item.originCancel ;
            item[clsNm] = !checkValue;
            if(clsNm ==='isCancel') {
                item.CancelUser = item.CancelUser ? item.CancelUser : item.userSMName;
            }
            if(item[clsNm]) {
                item[disableCell] = 'disabled';
            } else {
                item[disableCell] = originData ==='disabled' ? 'disabled' : false;
            }

        });
        let checkedList = grid.rows.map(item=>item.dataItem).filter(item=>item[clsNm] === true );
        grid.invalidate();
        LCC.sendMessage({'type': `checkedCell${clsNm}`, 'checkedList': checkedList ? checkedList : []});
    },
    checkCell : function (grid,e,self,clsNm) {
        let disableCell = clsNm ==='isRent' ? 'isCancel' : 'isRent';
        let selectedTag = e.target;
        let i = selectedTag.name.split(`${clsNm}-`)[1];
        if(selectedTag.checked){
            grid.rows[i].dataItem[`${clsNm}`] = true;
            grid.rows[i].dataItem[`${disableCell}`] = 'disabled';
            if(clsNm ==='isCancel') {
                grid.rows[i].dataItem.CancelUser = grid.rows[i].dataItem.CancelUser ? grid.rows[i].dataItem.CancelUser : grid.rows[i].dataItem.userSMName;grid.rows[i].dataItem.CancelUser = grid.rows[i].dataItem.CancelUser ? grid.rows[i].dataItem.CancelUser : grid.rows[i].dataItem.userSMName;
            }
        } else {
            let originClickCell =(clsNm ==='isRent' ) ?  grid.rows[i].dataItem.originRent :  grid.rows[i].dataItem.originCancel ;
            let originNotClickCell =(disableCell ==='isRent' ) ?  grid.rows[i].dataItem.originRent :  grid.rows[i].dataItem.originCancel ;
            grid.rows[i].dataItem[`${clsNm}`] = originClickCell ==='disabled' ? 'disabled' : false;
            grid.rows[i].dataItem[`${disableCell}`] = originNotClickCell ==='disabled' ? 'disabled' : false;
        }
        grid.invalidate();
        let checkedList = grid.rows.map(item=>item.dataItem).filter(item=>item[clsNm] === true );
        LCC.sendMessage({'type': `checkedCell${clsNm}`, 'checkedList': checkedList ? checkedList : []});
    },
    messageHandler : function(message) {
        const rowItem = [];
        switch (message.name.type) {
            case 'getSearchList':
                this.grid.rows.clear();
                const items = message.name.listPRLI;
                this.data.splice(0,this.data.length);
                this.data = items.map((item,i)=>{
                    const row = new wijmo.grid.Row();
                    // OrderReqType
                    row.dataItem=item;
                    row.dataItem.inputUserInfo = `${item.CreatedByName}${item.userEmplCode ? '['+item.userEmplCode+']' : ''}`;
                    // row.dataItem.receivedQuantity = item.ShippedDepartMent === item.LocationName ? item.requestQuantity : item.receivedQuantity;
                    // row.dataItem.receivedPartNo = item.ShippedDepartMent === item.LocationName ? item.requestPartNo : item.receivedPartNo;
                    // row.dataItem.ResrvStatus = item.ShippedDepartMent === item.LocationName ? '입고완료' : item.ResrvStatus;
                    // row.dataItem.rsvDate = item.ShippedDepartMent === item.LocationName ? item.CreatedDate.split(' ')[0].replaceAll('.','-') : item.rsvDate;
                    row.dataItem.ReceiveFormat = item.ReceiveNumber ? `${item.ReceiveNumber}${item.contactName ? ' ['+item.contactName+']' : ''}` : '';
                    row.dataItem.unprocessCode = item.unprocessCode ? `${item.unProcessLabel?.split('_')[0]}[${item.unProcessLabel?.split('_')[1]}]` : '';
                    this.grid.rows.push(row);
                    return item;
                })
                this.grid.itemsSource=this.data;
                break;
            case 'fnResrvInfoModalOpen':
                //console.log('fnResrvInfoModalOpen!!');
                var selectedList = [];
                this.grid.rows.forEach(item => {
                    if(item.isSelected){
                        selectedList.push(item.dataItem.parentId);
                    }
                });
                //console.log(selectedList);
                LCC.sendMessage({'type' : 'fnResrvInfoModalOpen', 'selectedList': selectedList});
                break;
            case 'downloadExcel' :
                let gridData=this.grid.rows.map(item=>item.dataItem);
                try {
                    let book = wijmo.grid.xlsx.FlexGridXlsxConverter.saveAsync(this.grid,{
                        includeColumnHeaders: true,
                        includeRowHeaders: false,
                        formatItem:null
                    }, '예약관리_미처리목록.xlsx');
                }
                catch (ex) {
                    console.error('에러;', ex);
                }
                break;
        }
    },
}
