import { View, Text, Pressable } from 'react-native';
import React, { useState } from 'react';
import Octicons from '@expo/vector-icons/Octicons';

type TaskListProps={
    taskname: string,
    time? : string
}

const TaskList = ({taskname, time}:TaskListProps) => {
  const [isCompleted, setIsCompleted] = useState(false);
  return (
    <Pressable onPress={() => setIsCompleted(!isCompleted)}>
      <View className="flex-row gap-4 bg-stone-900 p-4">
        {isCompleted ? (
          <Octicons name="check-circle-fill" size={30} color="white" />
        ) : (
          <Octicons name="circle" size={30} color="white" />
        )}

        <View>
          {isCompleted ? (
            <Text className="font-semibold text-white line-through ">{taskname}</Text>
          ) : (
            <Text className="font-semibold text-white">{taskname}</Text>
          )}
          {time &&           <Text className="text-neutral-600">{time}</Text>}

        </View>
      </View>
    </Pressable>
  );
};

export default TaskList;
