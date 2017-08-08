sap.ui.define(
	['sap/ui/core/Control'],
	function(Control) {
		return Control.extend("nl.barrydam.ui.OverlayIcon",{
			metadata: {
				properties: {
					// Icon src
					src     : {type : 'sap.ui.core.URI'},
					// Icon positioning
					top		: {
						type			: 'sap.ui.core.CSSSize',
						defaultValue	: '5px'
					},
					bottom	: {type : 'sap.ui.core.CSSSize' },
					left	: {type : 'sap.ui.core.CSSSize' },
					right	: {
						type			: 'sap.ui.core.CSSSize',
						defaultValue	: '5px'
					},
					// Icon bg color
					backgroundColor: {type : 'string' },
					// Icon color
					color	: {type : 'string' },
					// if set to true, the icon will only be shown on mouse over
					showOnHover	: { 
						type: 'boolean', 
						defaultValue: 'false'
					},
					// if set to false, the icon will be hidden and the element is not clickable
					enabledAndVisible: { type: 'boolean', defaultValue: true},
					tooltip: { type: 'string' }
				},
				aggregations: {
					content: {
						type:  "sap.ui.core.Control"
					}
				},
				defaultAggregation: "content",
				events : {
					press : {}
				}
			},

			onclick: function(e) {
				if (! this.getEnabledAndVisible()) { return; }
				if (this.hasListeners("press")) {
					// mark the event for components that needs to know if the event was handled
					e.setMarked();
				}
				this.firePress();
			},

			onmouseover : function() {
				if (! this.getShowOnHover() || ! this.getEnabledAndVisible() ) { return; }
				var $OverlayIcon = this.$().find('[data-overlayicon="true"]');
				$OverlayIcon.show();
			},

			onmouseout : function() {
				if (! this.getShowOnHover() || ! this.getEnabledAndVisible() ) { return; }
				var $OverlayIcon = this.$().find('[data-overlayicon="true"]');
				$OverlayIcon.hide();
			},

			renderer: function(oRm,oControl){
				var bPressable			= oControl.hasListeners("press"),
					bPointerClass		= (bPressable && oControl.getEnabledAndVisible()),
					sBackgroundColor	= oControl.getBackgroundColor(),
					sBGColorCSS			= "",
					sTooltip			= oControl.getTooltip(),
					oIcon				= new sap.ui.core.Icon({
						src   : oControl.getSrc(),
						color : oControl.getColor()
					}),
					bShowIcon			= (oControl.getShowOnHover() === false && oControl.getEnabledAndVisible());
				// set the height and with to 17px if there is an background color set
				// this is needed so that the bg will be funny round
				if (sBackgroundColor) {
					oIcon.setWidth("17px");
					oIcon.setHeight("17px");
				}
				// set icon tooltip
				if (oControl.getEnabledAndVisible() && sTooltip) {
					oIcon.setTooltip(sTooltip);
				}
				// Set the mouse hover style when it's clickable
				if (bPointerClass) {
					oIcon.addStyleClass("sapUiIconPointer");
				}
				// Icon Positions
				var sTop			= oControl.getTop(),
					sBottom			= oControl.getBottom(),
					sLeft			= oControl.getLeft(),
					sRight			= oControl.getRight(),
					sPositionCss	= "";
				if(sBottom) {
					sPositionCss += "bottom:"+sBottom+";";
				} else if (sTop){
					sPositionCss += "top:"+sTop+";";
				} 
				if (sLeft){
					sPositionCss += "left:"+sLeft+";";
				} else if(sRight) {
					sPositionCss += "right:"+sRight+";";
				}
				// background
				if (sBackgroundColor) {
					sBGColorCSS = "background-color:"+sBackgroundColor+";padding:5px;border-radius:20px;";
				}
				// Write the control
				oRm.write('<div'+((oControl.getEnabledAndVisible() && sTooltip)?' title="'+sTooltip+'"':'')+' class="customOverlayIcon'+((bPointerClass)?" sapUiIconPointer":"")+'" style="display:table;position:relative;"');
				oRm.writeControlData(oControl);
				oRm.write(">");
					oRm.write('<div'+((oControl.getEnabledAndVisible() && sTooltip)?' title="'+sTooltip+'"':'')+' data-overlayicon="true" style="position:absolute;'+((bShowIcon) ? "" : "display:none;" )+'z-index:2;'+sPositionCss+'">');
						if (sBGColorCSS) { oRm.write('<span style="'+sBGColorCSS+'">'); }
							oRm.renderControl(oIcon);
						if (sBGColorCSS) { oRm.write('</span>'); }
					oRm.write("</div>");
					oRm.write('<div'+((oControl.getEnabledAndVisible() && sTooltip)?' title="'+sTooltip+'"':'')+' style="z-index:1">');
						var aIds = [];
						$(oControl.getContent()).each(function(){
							if (bPointerClass) {
								this.addStyleClass("sapUiIconPointer");								
							}
							oRm.renderControl(this);
							aIds.push(this.getId());
						});
					oRm.write("</div>");
				oRm.write("</div>");
			},
			onAfterRendering: function() {
				//if I need to do any post render actions, it will happen here
				if(sap.ui.core.Control.prototype.onAfterRendering) {
					sap.ui.core.Control.prototype.onAfterRendering.apply(this,arguments); //run the super class's method first
				}
			}
		});
	}
);