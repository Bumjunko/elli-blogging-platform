drop policy if exists "Students can insert own post history" on public.post_status_history;
create policy "Students can insert own post history"
on public.post_status_history for insert
to authenticated
with check (
  changed_by = auth.uid()
  and exists (
    select 1
    from public.posts
    where posts.id = post_status_history.post_id
      and posts.author_id = auth.uid()
      and not posts.is_published
  )
  and (
    (from_status is null and to_status = 'draft')
    or (from_status = 'draft' and to_status = 'submitted')
    or (from_status = 'revision_requested' and to_status in ('draft', 'submitted'))
  )
);
