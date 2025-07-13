
'use client';

import Giscus from '@giscus/react';

export default function GiscusComments() {
    /**
     * Giscus Configuration
     * 
     * IMPORTANT: You need to replace the following values with your own GitHub repository details.
     * 
     * 1. repo: Your GitHub repository in '[owner]/[repo]' format.
     *    - Example: 'your-username/your-blog-repo'
     * 
     * 2. repoId: Your repository's ID. 
     *    - How to get it: You can use this tool https://giscus.app/ to easily find your repoId by entering your repository name.
     *    - Example: 'R_kgDOMabcde12345'
     * 
     * 3. category: The name of the discussion category you created in your repository for Giscus.
     *    - Note: Make sure you have enabled the "Discussions" feature in your repository settings.
     *    - Example: 'Announcements'
     * 
     * 4. categoryId: The ID of your discussion category.
     *    - How to get it: You can also find this using the Giscus configuration tool: https://giscus.app/
     *    - Example: 'DIC_kwDOMfrgfedcba'
     */

  return (
    <div className="mt-16">
        <Giscus
            repo="your-github-username/your-repo-name" // Replace this
            repoId="YOUR_REPO_ID" // Replace this
            category="Announcements" // Replace this
            categoryId="YOUR_CATEGORY_ID" // Replace this
            mapping="pathname"
            strict="0"
            reactionsEnabled="1"
            emitMetadata="0"
            inputPosition="top"
            theme="light"
            lang="bn"
            loading="lazy"
        />
    </div>
  );
}
