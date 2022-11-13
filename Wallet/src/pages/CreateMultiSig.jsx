/*global chrome*/
import React from "react";
import { useState, useEffect } from "react";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import RemoveCircleOutlinedIcon from "@mui/icons-material/RemoveCircleOutlined";
import { Typography, Box, Select, Button, Modal, TextField, MenuItem, Stack } from "@mui/material";
import * as ms from "../APIs/multisigAPI";
import { Link } from "react-router-dom";

const CreateMultiSig = () => {
	// publickey 불러오기
	const [userPub, setUserPub] = useState();
	chrome.storage.local.get("publicKey", (res) => {
		setUserPub(res.publicKey,);
		console.log(userPub);
	});

	const myPubKey = userPub;
	const [pubkeyList, setPubkeyList] = useState([myPubKey, ""]);
	const [idList, setIdList] = useState(["", ""]);
	const [num, setNum] = useState(2);
	const [multiSig, setMultiSig] = useState("");

	useEffect(() => {}, [multiSig]);

	const onAddDetailDiv = () => {
		setPubkeyList([...pubkeyList, ""]);
		setIdList([...idList, ""]);
	};

	const handleSelect = (event) => {
		setNum(event.target.value);
	};

	const onRemoveDetailDiv = () => {
		let pubkeyList2 = [...pubkeyList];
		if (pubkeyList.length != 2) {
			pubkeyList2.pop();
			setPubkeyList([...pubkeyList2]);
		}

		let idList2 = [...idList];
		if (idList.length != 2) {
			idList2.pop();
			setIdList([...idList2]);
		}
	};

	const generateAccount = (event) => {
		const result = ms.createMultiSig(num, pubkeyList);
		console.log(result);
		setMultiSig(result);
		chrome.storage.local.set({ multiSig: result.multiSig });
	};

	const DetailList = () => {
		return (
			<Box sx={{ flexGrow: 1, pt: 2}}>
				{pubkeyList.map((item, i) => (
					<div key={i}>
						<label style={{ marginTop: "20px" }}>{`User ${i + 1}`}</label>
						<div style={{ marginBottom: "20px" }}>
							<Typography variant="subtitle2">PubKey</Typography>
							<TextField
								size="small"
								disabled={i == 0 ? true : false}
								label={i == 0 ? myPubKey : ""}
								style={{ height: "2%", width: "90%" }}
								onChange={(e) => {
									let pubkeys = [...pubkeyList];
									pubkeys[i] = e.target.value;
									setPubkeyList([...pubkeys]);
								}}
							/>
							<Typography variant="subtitle2">Slack ID</Typography>
							<TextField
								size="small"
								style={{ height: "2%", width: "90%" }}
								onChange={(e) => {
									let id = [...idList];
									id[i] = e.target.value;
									setIdList([...id]);
								}}
							/>
						</div>
					</div>
				))}
			</Box>
		);
	};

	const SelectNum = () => {
		return (
			<Box sx={{ flexGrow: 1, p: 1 }}>
				<span style={{ marginRight: "30px" }}>{"Select signing threshold "}</span>
				<span>
					<Select
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						value={num}
						label="Sining threshhold"
						style={{ height: "25px" }}
						onChange={handleSelect}>
						{pubkeyList.map((item, i) => (i > 0 ? <MenuItem value={i + 1}>{i + 1}</MenuItem> : <div></div>))}
					</Select>
				</span>
			</Box>
		);
	};

	return (
		<Box sx={{ flexGrow: 1, p: 3 }}>
			<div>
				<Typography variant="button">Here is multisig account</Typography>
				<br/>
				<Typography variant="body2" color="primary">{`: ${multiSig}`}</Typography>
				{DetailList()}
				<Stack direction="row" justifyContent="center">
					<Button onClick={onAddDetailDiv}>
						<AddCircleOutlinedIcon /> 추가
					</Button>
					<Button onClick={onRemoveDetailDiv}>
						<RemoveCircleOutlinedIcon /> 삭제
					</Button>
				</Stack>
				{SelectNum()}		
			</div>
			<Stack spacing={1} sx={{pr:4, mt:1 }} justifyContent="center">
					<Button variant="contained" onClick={generateAccount}>
						{"Create multiSig account"}
					</Button>
				</Stack>
		</Box>
	);
};

export default CreateMultiSig;
