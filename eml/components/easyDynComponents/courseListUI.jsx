import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Layout } from '@ui-kitten/components';
import EasyDynamicList from './EasyDynamicList';
import CourseHeader from '../courses/CourseHeader';

export default function CourseListUI({ course }) {
    console.log(course);
    return (
        <View>
            <CourseHeader
                courseTitle={course.title}
                courseIcon={course.iconPath}
                courseId={course.id}
            ></CourseHeader>
            <EasyDynamicList course={course} ></EasyDynamicList>
        </View>
    );
};
