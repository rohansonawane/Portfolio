import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageMeta from '../components/seo/PageMeta';
import { getProjectBySlug } from '../lib/projects.js';
import { trackEvent } from '../lib/analytics';

export default function ProjectPage() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);

  useEffect(() => {
    trackEvent('project_view', { slug });
    import('../lib/project-page-init.js').then((mod) => {
      mod.initProjectPage(slug);
    });
  }, [slug]);

  return (
    <>
      <PageMeta
        title={project ? `${project.title} | Project` : 'Project'}
        description={project?.overview || 'Project case study from Rohan Sonawane\'s portfolio.'}
        path={`/project/${slug}`}
      />
      <div id="projectApp" className="project-shell" aria-live="polite" />
    </>
  );
}
