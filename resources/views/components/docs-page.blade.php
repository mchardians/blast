<div class="blast-h-screen blast-w-full blast-flex blast-flex-col blast-overflow-hidden blast-bg-white">

    <div class="blast-bg-blue-500 blast-text-white blast-shrink-0">
        <div class="blast-container blast-mx-auto blast-px-4 blast-flex blast-flex-col blast-pt-6 blast-pb-9 md:blast-pt-8 md:blast-pb-12">
            @if($label)
                <p class="blast-text-sm blast-antialiased">
                    {{ $label }}
                </p>
            @endif

            <div class="dev-page__hero-bottom">
                @if($title)
                    <h1 class="blast-mt-8 md:blast-mt-10 blast-text-6xl md:blast-text-7xl blast-font-semibold blast-antialiased blast-break-words">
                        {{ $title }}
                    </h1>
                @endif

                @if($description)
                    <div class="md:blast-w-10/12 blast-mt-4 md:blast-mt-5 blast-wysiwyg">
                        {!! \Illuminate\Support\Str::markdown($description) !!}
                    </div>
                @endif
            </div>
        </div>
    </div>

    <div class="blast-flex-1 blast-overflow-y-auto blast-w-full">
        <div class="blast-container blast-mx-auto blast-px-4 blast-mt-6 blast-pb-12">
            {{ $slot }}
        </div>
    </div>
</div>
