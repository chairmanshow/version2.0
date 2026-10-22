import React from 'react';
import { PageLayout } from '../../components/PageLayout';
import { RuralHealthDirectory } from '../../components/rural-health/RuralHealthDirectory';

export const RuralHealthPage: React.FC = () => {
  return (
    <PageLayout
      pageTitle="Rural Health Services Directory"
      pageSubtitle="Official Government Hospitals, Primary Health Centres (PHCs), CHCs & 24x7 Emergency Helplines"
      badge="Official Public Directory"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <RuralHealthDirectory />
      </div>
    </PageLayout>
  );
};
