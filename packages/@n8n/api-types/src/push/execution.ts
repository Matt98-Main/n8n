import type { ExecutionStatus, ITaskData, WorkflowExecuteMode } from 'n8n-workflow';

type ExecutionStarted = {
	type: 'executionStarted';
	data: {
		executionId: string;
		mode: WorkflowExecuteMode;
		startedAt: Date;
		workflowId: string;
		workflowName?: string;
		retryOf?: string;
		flattedRunData: string;
	};
};

type ExecutionWaiting = {
	type: 'executionWaiting';
	data: {
		executionId: string;
	};
};

type ExecutionFinished = {
	type: 'executionFinished';
	data: {
		executionId: string;
		workflowId: string;
		status: ExecutionStatus;
		/** @deprecated: Please construct execution data in the frontend from the data pushed in previous messages, instead of depending on this additional payload serialization */
		rawData?: string;
	};
};

type ExecutionRecovered = {
	type: 'executionRecovered';
	data: {
		executionId: string;
	};
};

type NodeExecuteBefore = {
	type: 'nodeExecuteBefore';
	data: {
		executionId: string;
		nodeName: string;
	};
};

type NodeExecuteAfter = {
	type: 'nodeExecuteAfter';
	data: {
		executionId: string;
		nodeName: string;
		data: ITaskData;

		/**
		 * When a worker relays updates about a manual execution to main, if the
		 * payload size is above a limit, we send only a placeholder to the client.
		 * Later once the execution is finished, we fetch the entire execution data
		 * and fill in any placeholders.
		 */
		isPlaceholder?: boolean;

		/**
		 * Number of output items after the node executed, when sending a
		 * placeholder to the client. This allows the client to know ahead of time
		 * how many items are there, to prevent the items count from jumping up when
		 * the execution finishes and the full data replaces the placeholder.
		 *
		 * See {@link isPlaceholder} for more details.
		 */
		itemCount?: number;
	};
};

export type ExecutionPushMessage =
	| ExecutionStarted
	| ExecutionWaiting
	| ExecutionFinished
	| ExecutionRecovered
	| NodeExecuteBefore
	| NodeExecuteAfter;
