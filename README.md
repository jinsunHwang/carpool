Upsert failed. First exception on row 0; first error: UNABLE_TO_LOCK_ROW, unable to obtain exclusive access to this record or 1 records: 1316D000000fpWjQAI: []
handleUploadFinished : function(component,event,helper) {
        let modalBody;
        let modalFooter;
        let bodyContent = '기존 데이터를 덮어씌우겠습니까?';
        $A.createComponents([
                ["aura:text", { "value": "기존 데이터를 덮어씌우겠습니까?" }],
                ["lightning:button", {
                    "variant": "brand",
                    "label": "확인",
                    "onclick": component.getReference("c.handleConfirm")
                }]
            ],
            function(components, status){
                if (status === "SUCCESS") {
                    modalBody = components[0];
                    modalFooter = components[1];
                    component.find('overlayLib').showCustomModal({
                        body: modalBody,
                        footer: modalFooter,
                        showCloseButton: true,
                    });

                }
            });
    },
    handleConfirm : function(component, event, helper) {
        console.log("Confirm button clicked.");

    },
