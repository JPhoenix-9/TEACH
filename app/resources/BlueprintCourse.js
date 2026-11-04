'use client';

import {useState} from 'react';
import s from './blueprint-course.module.css';

export default function BlueprintCourse({lessons}) {
  const videos = lessons.filter(lesson => lesson.video_url);
  const [selectedId, setSelectedId] = useState(videos[0]?.source_step_id);
  const [playbackError, setPlaybackError] = useState(false);
  const selected = videos.find(lesson => lesson.source_step_id === selectedId) || videos[0];
  if (!selected) return null;
  const index = videos.indexOf(selected);
  const modules = [...new Map(lessons.map(lesson => [lesson.source_section_id, {
    id: lesson.source_section_id, title: lesson.module_title,
  }])).values()];

  function choose(lesson) {
    if (!lesson) return;
    setPlaybackError(false);
    setSelectedId(lesson.source_step_id);
  }

  return <section className={s.course} aria-labelledby="blueprint-course-title">
    <h2 id="blueprint-course-title">Homeschool Success Blueprint</h2>
    <p>{modules.length===6?'All six modules are available in your account.':`Your account includes ${modules.length} of the six modules.`} Explore at your own pace, and return to any lesson.</p>
    {modules.length<6&&<p><a href="/blueprint#enroll">Explore the other Blueprint modules →</a></p>}
    <div className={s.layout}>
      <nav className={s.modules} aria-label="Blueprint modules and lessons">
        {modules.map(module => <details key={module.id} open={module.id === selected.source_section_id}>
          <summary>{module.title}</summary>
          <ol>{videos.filter(lesson => lesson.source_section_id === module.id).map(lesson =>
            <li key={lesson.source_step_id}><button type="button"
              aria-current={lesson.source_step_id === selected.source_step_id ? 'true' : undefined}
              onClick={() => choose(lesson)}>{lesson.title}</button></li>
          )}</ol>
        </details>)}
      </nav>
      <div className={s.viewer}>
        <p className={s.moduleName}>{selected.module_title}</p>
        <h3>{selected.title}</h3>
        <video key={selected.source_step_id} controls playsInline preload="none"
          src={selected.video_url} poster={selected.poster_url || undefined}
          aria-label={selected.title} onError={() => setPlaybackError(true)} />
        {playbackError && <p role="alert">This lesson couldn’t play. Check your connection and try again. If it continues, <a href="/contact">contact TEACH</a>.</p>}
        <div className={s.controls}>
          <button type="button" disabled={index === 0} onClick={() => choose(videos[index - 1])}>← Previous lesson</button>
          <span>Video {index + 1} of {videos.length}</span>
          <button type="button" disabled={index === videos.length - 1} onClick={() => choose(videos[index + 1])}>Next lesson →</button>
        </div>
      </div>
    </div>
  </section>;
}
