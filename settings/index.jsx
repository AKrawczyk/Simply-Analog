registerSettingsPage(props => {
  return (
    <Page>
      <Section title="Watch Faces">
        <Select label="Choose Watch Face"
          selectViewTitle="Choose Watch Face"
          settingsKey="faces"
          options={[
            {name: "01. No Watchface", value: "noface"},
            {name: "02. Quaters Watchface", value: "quaters"},
            {name: "03. Circle Watchface - Hours Only", value: "hours"},
            {name: "04. Circle Watchface", value: "circle"},
            {name: "05. Square Watchface - Hours Only", value: "squarehours"},
            {name: "06. Square Watchface", value: "square"},
            {name: "07. Digital Watchface", value: "time"},
            {name: "08. Quaters Watchface Sepctrum", value: "quatersspec"},
            {name: "09. Circle Watchface Spectrum - Hours Only", value: "hoursspec"},
            {name: "10. Circle Watchface Spectrum", value: "circlespec"},
            {name: "11. Square Watchface Spectrum - Hours Only", value: "squarehoursspec"},
            {name: "12. Square Watchface Spectrum", value: "squarespec"}
          ]}
          onSelection={sel => props.settingsStorage.setItem("firstfaces2", JSON.stringify(sel))}
        />
      </Section>
      
      <Section title="Watch Theme">
        <Text>Background Colour</Text>
        <ColorSelect
          settingsKey="Backgroundtheme"
          centered={true}
          colors={[
            {color: "red", value: "red"},
            {color: "orange", value: "orange"},
            {color: "yellow", value: "yellow"},
            {color: "green", value: "green"},
            {color: "blue", value: "blue"},
            {color: "indigo", value: "indigo"},
            {color: "violet", value: "violet"},
            {color: "#3182DE", value: "fbblue"},
            {color: "#A51E7C", value: "fbplum"},
            {color: "#A0A0A0", value: "fblightgray"},
            {color: "peachpuff", value: "peachpuff"},
            {color: "black", value: "black"},
            {color: "#888888", value: "grey"},
            {color: "white", value: "white"}
          ]}
        />
        <Text>Background Image</Text>
        <Toggle settingsKey="BackgroundImgtheme" label="For Watchfaces 1-7" />
        <Text>Time Colour</Text>
        <ColorSelect
          settingsKey="Clocktheme"
          centered={true}
          colors={[
            {color: "tomato", value: "red"},
            {color: "sandybrown", value: "orange"},
            {color: "gold", value: "yellow"},
            {color: "lawngreen", value: "green"},
            {color: "deepskyblue", value: "blue"},
            {color: "plum", value: "purple"},
            {color: "mediumblue", value: "navy"},
            {color: "black", value: "black"},
            {color: "grey", value: "grey"},
            {color: "white", value: "white"}
          ]}
        />
        <Text>Seconds Colour</Text>
        <ColorSelect
          settingsKey="Stheme"
          centered={true}
          colors={[
            {color: "tomato", value: "red"},
            {color: "sandybrown", value: "orange"},
            {color: "gold", value: "yellow"},
            {color: "lawngreen", value: "green"},
            {color: "deepskyblue", value: "blue"},
            {color: "plum", value: "purple"},
            {color: "mediumblue", value: "navy"},
            {color: "black", value: "black"},
            {color: "grey", value: "grey"},
            {color: "white", value: "white"}
          ]}
        />
       <Text>Date, Battery and Text Colour</Text>
       <ColorSelect
          settingsKey="Texttheme"
          centered={true}
          colors={[
            {color: "tomato", value: "red"},
            {color: "sandybrown", value: "orange"},
            {color: "gold", value: "yellow"},
            {color: "lawngreen", value: "green"},
            {color: "deepskyblue", value: "blue"},
            {color: "plum", value: "purple"},
            {color: "mediumblue", value: "navy"},
            {color: "black", value: "black"},
            {color: "grey", value: "grey"},
            {color: "white", value: "white"}
          ]}
        />
        <Toggle settingsKey="ShowDate" label="Display Date" />
        <Toggle settingsKey="ShowBattery" label="Display Battery" />
      </Section> 
      
      <Section title="Steps Theme">
        <Text>Steps Ring Colour</Text>
        <ColorSelect
          settingsKey="Stepstheme"
          centered={true}
          colors={[
            {color: "tomato", value: "red"},
            {color: "sandybrown", value: "orange"},
            {color: "gold", value: "yellow"},
            {color: "lawngreen", value: "green"},
            {color: "deepskyblue", value: "blue"},
            {color: "plum", value: "purple"},
            {color: "mediumblue", value: "navy"},
            {color: "black", value: "black"},
            {color: "grey", value: "grey"},
            {color: "white", value: "white"}
          ]}
        />
        <Toggle settingsKey="ShowStepsRings" label="Display Steps Ring" />
      </Section>
      
      <Section title="Calories Theme">
        <Text>Calories Ring Colour</Text>
        <ColorSelect
          settingsKey="Caloriestheme"
          centered={true}
          colors={[
            {color: "tomato", value: "red"},
            {color: "sandybrown", value: "orange"},
            {color: "gold", value: "yellow"},
            {color: "lawngreen", value: "green"},
            {color: "deepskyblue", value: "blue"},
            {color: "plum", value: "purple"},
            {color: "mediumblue", value: "navy"},
            {color: "black", value: "black"},
            {color: "grey", value: "grey"},
            {color: "white", value: "white"}
          ]}
        />
        <Toggle settingsKey="ShowCaloriesRings" label="Display Calories Ring" />
      </Section>
      
      <Section title="Activity Theme">
        <Text>Activity Ring Colour</Text>
        <ColorSelect
          settingsKey="Activitytheme"
          centered={true}
          colors={[
            {color: "tomato", value: "red"},
            {color: "sandybrown", value: "orange"},
            {color: "gold", value: "yellow"},
            {color: "lawngreen", value: "green"},
            {color: "deepskyblue", value: "blue"},
            {color: "plum", value: "purple"},
            {color: "mediumblue", value: "navy"},
            {color: "black", value: "black"},
            {color: "grey", value: "grey"},
            {color: "white", value: "white"}
          ]}
        />
        <Toggle settingsKey="ShowActivityRings" label="Display Activity Ring" />
      </Section>
      
      <Section title="Distance Theme">
        <Text>Distance Ring Colour</Text>
        <ColorSelect
          settingsKey="Distancetheme"
          centered={true}
          colors={[
            {color: "tomato", value: "red"},
            {color: "sandybrown", value: "orange"},
            {color: "gold", value: "yellow"},
            {color: "lawngreen", value: "green"},
            {color: "deepskyblue", value: "blue"},
            {color: "plum", value: "purple"},
            {color: "mediumblue", value: "navy"},
            {color: "black", value: "black"},
            {color: "grey", value: "grey"},
            {color: "white", value: "white"}
          ]}
        />
        <Toggle settingsKey="ShowDistanceRings" label="Display Distance Ring" />
      </Section>
      
      <Section title="Heartrate Theme">
        <Text>Heartrate Ring Colour</Text>
        <ColorSelect
          settingsKey="Heartratetheme"
          centered={true}
          colors={[
            {color: "tomato", value: "red"},
            {color: "sandybrown", value: "orange"},
            {color: "gold", value: "yellow"},
            {color: "lawngreen", value: "green"},
            {color: "deepskyblue", value: "blue"},
            {color: "plum", value: "purple"},
            {color: "mediumblue", value: "navy"},
            {color: "black", value: "black"},
            {color: "grey", value: "grey"},
            {color: "white", value: "white"}
          ]}
        />
        <Toggle settingsKey="ShowHeartrateRings" label="Display Heartrate Ring" />
      </Section>
    </Page>
  );
});
