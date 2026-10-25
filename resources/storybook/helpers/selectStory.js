export const slugify = (text) =>
    String(text || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

export const selectStory = (context, storySlug) => {
    const fallback = {
        id: context.baseStoryId,
        sourceCode: context.sourceCode,
        defaultArgs: context.defaultArgs
    };

    if (!storySlug || !Array.isArray(context.stories)) return fallback;

    const found = context.stories.find(
        (story) => slugify(story.name) === slugify(storySlug)
    );

    return found || fallback;
};
