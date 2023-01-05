import axios from "axios";
const URL =
  "https://script.google.com/macros/s/AKfycbxk9juvSBno92vj4gEKcDqPSPW36KOtpm16ZpvPAOTSFCSOyEkfLcM6AKAxdk2IKW9O/exec";

interface senderProps {
  serverName: string;
  devID?: string;
  sortKey?: string;
}

export const ZC_ErrorLogger = (
  value: any,
  message: { text: string; toLog: boolean },
  senderID?: senderProps | null,
  data?: any | null,
  toPost = true,
  toTimeStemp = true
) => {
  if (!message?.toLog) message.toLog = true;
  console.log(`${Object.keys(value)[0]} ${{ value }} \n ${message?.toLog && message?.text}`);

  axios.get(
    URL +
      `?timestemp=${toTimeStemp}&senderid=${senderID ? JSON.stringify(senderID) : false}&message=${
        message.text
      }&value=${value}&data=${data ? data : false}&type=postlogerlog`
  );
};

module.exports.ZC_ErrorLogger = ZC_ErrorLogger;
