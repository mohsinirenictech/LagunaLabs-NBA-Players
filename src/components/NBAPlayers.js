import React, { useState } from "react";

import * as XLSX from "xlsx";

import ExportToCSV from "./ExportToCSV";

const NBAPlayers = () => {
  const [fileName, setFileName] = useState();
  const [fileContent, setFileContent] = useState([]);

  const filesExtArr = [".csv", ".xlsx", ".doc", ".docx", ".txt"];

  const actualFullNamesArr = fileContent.map((personName) => (
    <p key={personName.NAME}>{personName.NAME}</p>
  ));

  const handleFileChosen = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const workBook = XLSX.read(bufferArray, { type: "buffer" });
        const workSheetName = workBook.SheetNames[0];
        const workSheet = workBook.Sheets[workSheetName];
        const data = XLSX.utils.sheet_to_json(workSheet);

        resolve(data);
      };

      setFileName(file.name);

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((data) => {
      setFileContent(data);
    });
  };

  const fullNamesSplited = fileContent.map((person) => (
    <p key={person.NAME}>{person.NAME.split(" ")}</p>
  ));
  const firstNames = fullNamesSplited.map((firstName) => (
    <p key={firstName.props.children[0]}>{firstName.props.children[0]}</p>
  ));
  const lastNames = fullNamesSplited.map((lastName) => (
    <p key={lastName.props.children[lastName.props.children.length - 1]}>
      {lastName.props.children[lastName.props.children.length - 1]}
    </p>
  ));

  const alteredFullNames = [];

  firstNames.forEach((item, index) => {
    if (firstNames.length === index + 1) {
      alteredFullNames[index] =
        firstNames[index].props.children + " " + lastNames[0].props.children;
    } else {
      alteredFullNames[index] =
        firstNames[index].props.children +
        " " +
        lastNames[index + 1].props.children;
    }
  });

  const putAlteredNames = actualFullNamesArr.map(
    (item, ind) => (fileContent[ind].NAME = alteredFullNames[ind])
  );

  console.log(fileContent);
  console.log(actualFullNamesArr);
  console.log(alteredFullNames);
  console.log(putAlteredNames);

  return (
    <div style={{ margin: "5px" }}>
      <h1>Laguna Labs</h1>
      <input
        type="file"
        id="file"
        accept={filesExtArr}
        onChange={(e) => {
          const file = e.target.files[0];
          handleFileChosen(file);
        }}
      />
      <br />
      <h4>{fileName}</h4>

      {fileName && <ExportToCSV csvData={fileContent} fileName={fileName} />}

      {fileContent.length > 0 ? (
        <>
          <table style={{ padding: "20px", margin: "0 auto" }} cellPadding="5">
            <thead>
              <th>Name</th>
              <th>POS</th>
              <th>Age</th>
              <th>Height</th>
              <th>Weight</th>
              <th>College</th>
              <th>Salary</th>
            </thead>
            <tbody>
              {fileContent.map((person, i) => (
                <tr key={i}>
                  <td>{person.NAME}</td>
                  <td>{person.POS}</td>
                  <td>{person.AGE}</td>
                  <td>{person.Height}</td>
                  <td>{person.Weight}</td>
                  <td>{person.COLLEGE}</td>
                  <td>{person.SALARY}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : null}

      {/* <div
        style={{
          display: "inline-flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <h4>Actual Names</h4>
        {actualFullNamesArr.map((item) => (
          <p key={item.props.children}>{item.props.children}</p>
        ))}
        <br />
      </div> */}
      <div
        style={{
          display: "inline-flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <h4>Altered Names</h4>
        {alteredFullNames.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </div>
  );
};

export default NBAPlayers;
