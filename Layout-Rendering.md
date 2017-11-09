


## Layout.render()
Common layout rendering sequence in Layout.render() first creates
instances of layout specific LayoutTemplate and Theme and calls
LayoutTemplate.renderLayout() for actual rendering.

Before the LayoutTemplate.renderLayout method is called, all layout
blocks are grouped to zones, each wrapped in a LayoutZoneWrapper object,
which in turn holds a collection of zone blocks wrapped in 
LayoutZoneBlockWrapper objects. 

    Layout.render()
      new LayoutTemplate()
      getLayoutInfo()
      getHadContributions()
      renderLayout()
        renderZones()
          decorateZone()              [0..n]
            renderBlockGroups() (???)
              decorateBlockGroup()    [0..n]
                decorateBlock()       [0..n]
        
Following is a code sample from class Layout:

    // From class Layout:
    // (NOTE: lots of code omitted for clarity)
    render() {
      // Every render request gets a new instance
      // of LayoutTemplate and Theme:
      layoutTemplate = new LayoutTemplate()
      theme = new Theme()
    
      // Request layoutInfo:
      layoutInfo = layoutTemplate.getLayoutInfo()

      // Map blocks to zones:
      zones = mapLayoutZones();

      // Request head contributions:
      contribs = layoutTemplate.getHeadContributions()
    
      // Render the theme Component
      theme.render()
    
      // Apply page head contributions
      applyContributions(contribs)
    
      # Finally render the layout:
      layoutTemplate.renderLayout(zones)
    }
    
The LayoutTemplate typically calls
render() methods of zone and block wrapper objects:
    
    // From class LayoutTemplate:
    // (NOTE: lots of code omitted for clarity)
    renderLayout(zones) {
        return this.renderZones(zones);
    }
    
    renderZones(zones, filter) {
      const info = this.getLayoutInfo();
      const zoneIds = info.zones;
      zoneIds.forEach((zoneId) => {
        const zone = zones[zoneId];
        if (filter(zoneId, zone)) {
          // Call the zone.render() method:
          components.push(zone.render(this));
        }
      });
      return (
        <div className="zones">{components}</div>
      );
    }
    
LayotZoneWrapper.render() method invokes the following  chain:

    // Pseudo code for LayoutZoneWrapper render sequence:
    //
    for each zone: LayoutTemplate.decorateZone(
      for each blockGroup: LayoutTemplate.decorateBlockGroup(
        for each block: LayoutTemplate.decorateBlock(
          block.render()
        )
      )
    )
    
If the decorateBlockGroup method is present, blocks are grouped by
group names returning from LayoutTemplate.getBlockGroup() method 
(invoked before LayoutTemplate.decorateBlockGroup).

Finally, LayoutZoneBlockWrapper.render() method is invoked, which in
turn creates a Block component.
