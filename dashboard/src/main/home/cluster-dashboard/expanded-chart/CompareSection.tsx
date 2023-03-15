import React, { useEffect, useState } from "react";
import styled from "styled-components";

import api from "shared/api";
import { ChartType} from "shared/types";

import RadioFilter from "components/RadioFilter";
import branch from "assets/branch.png";
import ValuesYaml from "./ValuesYaml";

type CompareProps = {
	currentChart: ChartType;
	currentCluster: any,
	currentProject: any,
	devOpsMode: boolean;
}

const getRevNumsGT = (arr: any[], num: number) => {
	return arr.filter((item) => {
		return item.value >= num
	})
}

const getRevisions = (currentChart: any, currentCluster: any, currentProject: any) => {

	return api
		.getRevisions(
			"<token>",
			{},
			{
				id: currentProject.id,
				namespace: currentChart.namespace,
				cluster_id: currentCluster.id,
				name: currentChart.name,
			}
		)
		.then((res) => {
			res.data.sort((a: ChartType, b: ChartType) => {
				return -(a.version - b.version);
			});

			return (res.data)
		})
		.catch(console.log);
}

const CompareSection: React.FC<CompareProps> = ({
	currentChart,
	currentCluster,
	currentProject,
	devOpsMode,
}) => {
	const [revisions, setRevisions] = useState([])
	const [revisionList, setRevisionList] = useState([{ label: 'p1', value: 'p2' }]);
	const [modifiedRevisionList, setModifiedRevisionList] = useState([]);
	const [rev1, setRev1] = useState()
	const [rev2, setRev2] = useState()

	const [rev1Chart, setRev1Chart] = useState<ChartType>(null)
	const [rev2Chart, setRev2Chart] = useState<ChartType>(null)


	useEffect(() => {
		getRevisions(currentChart, currentCluster, currentProject).then((res) => {
			setRevisions(res)

			const list = res.map((a: any, key: number) => { return { label: a.version, value: a.version } })
			setRevisionList(list)
		}).catch((err) => console.log(err))
	}, [])

	useEffect(() => {
		console.log(devOpsMode)
	}, [devOpsMode])

	useEffect(() => {
		api
			.getChart(
				"<token>",
				{},
				{
					id: currentProject.id,
					namespace: currentChart.namespace,
					cluster_id: currentCluster.id,
					name: currentChart.name,
					revision: rev1,
				}
			)
			.then((res) => {
				setRev1Chart(res.data)
			})

		api
			.getChart(
				"<token>",
				{},
				{
					id: currentProject.id,
					namespace: currentChart.namespace,
					cluster_id: currentCluster.id,
					name: currentChart.name,
					revision: rev2,
				}
			)
			.then((res) => {
				setRev2Chart(res.data)
			})
			.catch(console.log);

	}, [rev1, rev2])

	const handleSetActive = (id: any) => {
		setRev1(id)
		const mrl = getRevNumsGT(revisionList, id);
		setModifiedRevisionList(mrl);
	};

	const handleSetSecondActive = (id: any) => {
		setRev2(id)
	}

	return (
		<>
			<ComparisonHeader>
				Compare revision
				<RadioFilter
					icon={branch}
					selected={rev1}
					setSelected={handleSetActive}
					options={revisionList}
					name="Previous"
				/>
				with
				<RadioFilter
					icon={branch}
					selected={rev2}
					setSelected={handleSetSecondActive}
					options={modifiedRevisionList}
					name="Current"
				/>
			</ComparisonHeader>
			{!rev1Chart || !rev2Chart ? 1 :
				<StyledYamlEditorContainer>
					<ValuesYaml
						currentChart={rev1Chart}
						diffWith={rev2Chart}
						refreshChart={() => { }}
						disabled={true}
					/>
				</StyledYamlEditorContainer>}

		</>
	)
}

export default CompareSection;

const StyledYamlEditorContainer = styled.div`
.parent .child {
	width: 50%
}
`

const ComparisonHeader = styled.div`
  color: "#ffffff18";
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  font-size: 13px;
  width: 100%;
  padding-left: 15px;
  cursor: default;
  :hover {
    background: "#ffffff18";
    > div > i {
      background: "#ffffff22";
    }
  }
`;