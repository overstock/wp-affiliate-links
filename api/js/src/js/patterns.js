var ostk_patterns = [
    {
        "name": "Search Query",
        "slug": "search",
        "description": "The Search Query shortcode will create a link that will take a user to a Search Results Page on Overstock.com.",
        "notes": [],
        "example_shortcodes": [
            {
                "type": "search",
                "query": "soccer shoes"
            },
            {
                "type": "search",
                "query": "soccer shoes",
                "link_text": "Overstock has great soccer shoes"
            }
        ],
        "required_attributes": [
            {
                "name": "type",
                "description": "= \"search\""
            },
            {
                "name": "query",
                "description": "Product search terms",
                "example": "soccer shoes"
            }
        ],
        "optional_attributes": [
            {
                "name": "link_text",
                "description": "The text that will show for the link",
                "default": "\"query\" attribute text",
                "example": "Click to see these soccer shoes!",
                "notes": [
                    "The query will be used as the link text if the link_text parameter is empty (i.e. \"soccer shoes\")."
                ]
            },
            {
                "name": "category",
                "description": "Filter results by store",
                "options": [
                    "Home & Garden",
                    "Jewelry & Watches",
                    "Sports & Toys",
                    "Worldstock Fair Trade",
                    "Clothing & Shoes",
                    "Health & Beauty",
                    "Food & Gifts",
                    "Office Supplies",
                    "Luggage & Bags",
                    "Crafts & Sewing",
                    "Baby",
                    "Pet Supplies",
                    "Emergency Preparedness",
                    "Bedding & Bath"
                ]
            },
            {
                "name": "sort_by",
                "description": "Sort results in different ways",
                "options": [
                    "Relevance", 
                    "Recommended",
                    "Reviews", 
                    "Lowest Price", 
                    "Highest Price", 
                    "New Arrivals"
                ]
            },
            {
                "name": "link_target",
                "description": "Choose how to open the link.",
                "default": "new_tab",
                "options": [
                    "new_tab", 
                    "current_tab"
                ]
            }
        ]
    },
    {
        "name": "Link",
        "slug": "link",
        "description": "The URL link shortcode lets you create links to any page on Overstock.com.",
        "example_shortcodes": [
            {
                "type": "link",
                "url": "http://www.overstock.com/Worldstock-Fair-Trade/Natural-Thailand/9179503/product.html"
            },
            {
                "type": "link",
                "url": "http://www.overstock.com/Worldstock-Fair-Trade/Natural-Thailand/9179503/product.html",
                "link_text": "I want to buy this for my wife"
            }
        ],
        "required_attributes": [
            {
                "name": "type",
                "description": "= \"link\""
            },
            {
                "name": "url",
                "description": "A link to an Overstock page",
                "example": "http://www.overstock.com/Worldstock-Fair-Trade/Natural-Thailand/9179503/product.html"
            }
        ],
        "optional_attributes": [
            {
                "name": "link_text",
                "description": "The text that will show for the link",
                "default": "A link to Overstock.com",
                "example": "A present for my wife",
                "notes": [
                    "If link_text parameter is left blank, the phrase \"A link to Overstock.com\" will be used as the link text."
                ]
            },
            {
                "name": "link_target",
                "description": "Choose how to open the link.",
                "default": "new_tab",
                "options": [
                    "new_tab", 
                    "current_tab"
                ]
            }
        ]
    },
    {
        "name": "Rectangle",
        "slug": "rectangle",
        "description": "The rectangle shortcode lets you create a rectangular banner for a SINGLE product.",
        "notes": [
            "You will get the product id from the products URL on Overstock.com. For instance, the product URL \"http://www.overstock.com/Home-Garden/DHP-Emily-Grey-Linen-Chaise-Lounger/<span class=\"highlight\">9747008</span>/product.html\" has a product ID of <span class=\"highlight\">9747008</span>."
        ],
        "example_shortcodes": [
            {
                "type": "rectangle",
                "id": "9747008",
                "width": "300px"
            }
        ],
        "required_attributes": [
            {
                "name": "type",
                "description": "= \"rectangle\""
            },
            {
                "name": "id",
                "description": "A products id",
                "example": "8231882"
            }
        ],
        "optional_attributes": [
            {
                "name": "width",
                "description": "Width of the shortcode element. This attribute accepts \"px\" or \"%\"",
                "default": "100%",
                "example": "100%\" or \"300px"
            },
            {
                "name": "link_target",
                "description": "Choose how to open the link.",
                "default": "new_tab",
                "options": [
                    "new_tab", 
                    "current_tab"
                ]
            }
        ]
    },
    {
        "name": "Leaderboard",
        "slug": "leaderboard",
        "description": "Lets you create a leaderboard banner for up to two products.",
        "notes": [
            "You will get the product id from the products URL on Overstock.com. For instance, the product URL \"http://www.overstock.com/Home-Garden/DHP-Emily-Grey-Linen-Chaise-Lounger/<span class=\"highlight\">9747008</span>/product.html\" has a product ID of <span class=\"highlight\">9747008</span>.",
            "Leaderboard is set to 728px by 90px"
        ],
        "example_shortcodes": [
            {
                "type": "leaderboard",
                "product_ids": "8641092"
            },
            {
                "type": "leaderboard",
                "product_ids": "8641092, 9547029"
            }
        ],
        "required_attributes": [
            {
                "name": "type",
                "description": "= \"leaderboard\""
            },
            {
                "name": "product_ids",
                "description": "A list of product ids separated by commas.",
                "notes": ["Required to have 1 or 2 product ids"]
            }
        ],
        "optional_attributes": [
            {
                "name": "link_target",
                "description": "Choose how to open the link.",
                "default": "new_tab",
                "options": [
                    "new_tab", 
                    "current_tab"
                ]
            }
        ]
    },
    {
        "name": "Skyscraper",
        "slug": "skyscraper",
        "description": "Lets you create a skyscraper banner for up to three products.",
        "notes": [
            "You will get the product id from the products URL on Overstock.com. For instance, the product URL \"http://www.overstock.com/Home-Garden/DHP-Emily-Grey-Linen-Chaise-Lounger/<span class=\"highlight\">9747008</span>/product.html\" has a product ID of <span class=\"highlight\">9747008</span>."
        ],
        "example_shortcodes": [
            {
                "type": "skyscraper",
                "product_ids": "8641092, 9547029",
                "width": "160px"
            }
        ],
        "required_attributes": [
            {
                "name": "type",
                "description": "= \"skyscraper\""
            },
            {
                "name": "product_ids",
                "description": "A list of product ids separated by commas.",
                "notes": ["Required to have 1, 2, or 3 product ids."]
            }
        ],
        "optional_attributes": [
            {
                "name": "width",
                "description": "Width of the shortcode element. This attribute accepts \"px\" or \"%\"",
                "default": "100%",
                "example": "100%\" or \"300px"
            },
            {
                "name": "link_target",
                "description": "Choose how to open the link.",
                "default": "new_tab",
                "options": [
                    "new_tab", 
                    "current_tab"
                ]
            }
        ]
    },
    {
        "name": "Carousel",
        "slug": "carousel",
        "description": "Lets you create a carousel widget for up to 10 products. You will get the product ids from the product&apos;s URL on Overstock.com.",
        "notes": [
            "You will get the product id from the products URL on Overstock.com. For instance, the product URL \"http://www.overstock.com/Home-Garden/DHP-Emily-Grey-Linen-Chaise-Lounger/<span class=\"highlight\">9747008</span>/product.html\" has a product ID of <span class=\"highlight\">9747008</span>.",
            "<span class=\"red\">At least one of the starred \"*\" optional attributes must be provided. For instance, a carousel can be created by EITHER a list of product ids, a category, or a keywords.</span>"
        ],
        "example_shortcodes": [
            {
                "type": "carousel",
                "product_ids": "9659704,6753542,5718385,5735179",
                "width": "400px"
            }
        ],
        "required_attributes": [
            {
                "name": "type",
                "description": "= \"carousel\""
            }
        ],
        "optional_attributes": [
            {
                "name": "product_ids",
                "description": "<span class=\"red\">*</span> A list of product ids separated by commas."
            },
            {
                "name": "category",
                "description": "<span class=\"red\">*</span> Select items from a specific Overstock store.",
                "options": [
                    "Home & Garden",
                    "Jewelry & Watches",
                    "Sports & Toys",
                    "Worldstock Fair Trade",
                    "Clothing & Shoes",
                    "Health & Beauty",
                    "Food & Gifts",
                    "Office Supplies",
                    "Luggage & Bags",
                    "Crafts & Sewing",
                    "Baby",
                    "Pet Supplies",
                    "Emergency Preparedness",
                    "Bedding & Bath"
                ]
            },
            {
                "name": "keywords",
                "description": "<span class=\"red\">*</span> A keyword search",
                "example": "soccer shoes"
            },
            {
                "name": "number_of_items",
                "description": "Choose an item limit. By default it is unlimited.",
                "example": "10"
            },
            {
                "name": "sort_by",
                "description": "Choose a sort option",
                "options": [
                    "Relevance", 
                    "Recommended",
                    "Reviews",
                    "Lowest Price", 
                    "Highest Price", 
                    "New Arrivals"
                ]
            },
            {
                "name": "width",
                "description": "Width of the shortcode element. This attribute accepts \"px\" or \"%\"",
                "default": "100%",
                "example": "100%\" or \"300px"
            },
            {
                "name": "link_target",
                "description": "Choose how to open the link.",
                "default": "new_tab",
                "options": [
                    "new_tab", 
                    "current_tab"
                ]
            }
        ]
    },
    {
        "name": "Stock Photo",
        "slug": "stock_photo",
        "description": "Use Overstock&apos;s product and lifestyle photos for your blog. Each one will link to its corresponding product page on Overstock.com.",
        "notes": [
            "You will get the product id from the products URL on Overstock.com. For instance, the product URL \"http://www.overstock.com/Home-Garden/DHP-Emily-Grey-Linen-Chaise-Lounger/<span class=\"highlight\">9747008</span>/product.html\" has a product ID of <span class=\"highlight\">9747008</span>."
        ],
        "example_shortcodes": [
            {
                "type": "stock_photo",
                "id": "8859234",
                "width": "300px"
            }
        ],
        "required_attributes": [
            {
                "name": "type",
                "description": "= \"stock_photo\""
            },
            {
                "name": "id",
                "example": "10234427",
                "description": "Choose an attribute to display"
            }
        ],
        "optional_attributes": [
            {
                "name": "image_number",
                "description": "Choose an image number, images are numbered from left to right on the product page, 1,2,3, ect."
            },
            {
                "name": "width",
                "description": "Width of the shortcode element. This attribute accepts \"px\" or \"%\"",
                "default": "100%",
                "example": "100%\" or \"300px"
            },
            {
                "name": "height",
                "description": "Height of the shortcode element. This attribute accepts \"px\"",
                "notes": [
                    "The height of the image will automatically adjust according to the width. The best practice would be to only set the height if it absolutely necessary ."
                ],
                "default": "auto",
                "example": "300px"
            },
            {
                "name": "link_target",
                "description": "Choose how to open the link.",
                "default": "new_tab",
                "options": [
                    "new_tab", 
                    "current_tab"
                ]
            },
            {
                "name": "custom_css",
                "description": "Add custom CSS to the image element.",
                "example": "border:solid 1px red;"
            }
        ]
    },
    {
        "name": "Product Details Link",
        "slug": "product_link",
        "description": "Create simple links for a certain product. Each one will link to the product page on Overstock.com.",
        "notes": [
            "You will get the product id from the products URL on Overstock.com. For instance, the product URL \"http://www.overstock.com/Home-Garden/DHP-Emily-Grey-Linen-Chaise-Lounger/<span class=\"highlight\">9747008</span>/product.html\" has a product ID of <span class=\"highlight\">9747008</span>."
        ],
        "example_shortcodes": [
            {
                "type": "product_link",
                "display": "name",
                "id": "8859234"
            }
        ],
        "required_attributes": [
            {
                "name": "type",
                "description": "= \"product_link\""
            },
            {
                "name": "id",
                "example": "10234427",
                "description": "Choose an attribute to display"
            },
            {
                "name": "display",
                "description": "Choose an attribute to display",
                "options": [
                    "name",
                    "price",
                    "description"
                ]
            }
        ],
        "optional_attributes": [
            {
                "name": "link_target",
                "description": "Choose how to open the link.",
                "default": "new_tab",
                "options": [
                    "new_tab", 
                    "current_tab"
                ]
            }
        ]
    },
    {
        "name": "Product Carousel",
        "slug": "product_carousel",
        "description": "Create a simple carousel viewer for a certain product. Each image will link to the product page on Overstock.com.",
        "notes": [],
        "example_shortcodes": [
            {
                "type": "product_carousel",
                "id": "9659704",
                "width": "400px"
            }
        ],
        "required_attributes": [
            {
                "name": "type",
                "description": "= \"product_carousel\""
            },
            {
                "name": "id",
                "description": "Any product id",
                "example": "10234427"
            }
        ],
        "optional_attributes": [
            {
                "name": "number_of_items",
                "description": "Choose an item limit. By default it is unlimited.",
                "example": "10"
            },
            {
                "name": "width",
                "description": "Width of the shortcode element. This attribute accepts \"px\" or \"%\"",
                "default": "100%",
                "example": "100%\" or \"300px"
            },
            {
                "name": "link_target",
                "description": "Choose how to open the link.",
                "default": "new_tab",
                "options": [
                    "new_tab", 
                    "current_tab"
                ]
            }
        ]
    },
    {
        "name": "Sample Data",
        "slug": "sample_data",
        "description": "Print data form a given ID",
        "notes": [],
        "example_shortcodes": [
            {
                "type": "sample_data",
                "id": "9659704"
            }
        ],
        "required_attributes": [
            {
                "name": "type",
                "description": "= \"sample_data\""
            },
            {
                "name": "id",
                "description": "Any product id",
                "example": "10234427"
            }
        ],
        "optional_attributes": [
        ]
    }
];